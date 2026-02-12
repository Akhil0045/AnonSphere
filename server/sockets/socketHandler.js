const Message = require('../models/Message');
const PrivateMessage = require('../models/PrivateMessage');
const xss = require('xss');
const bcrypt = require('bcryptjs');
const { encrypt, decrypt } = require('../utils/encryption');

// State tracking: { roomName: Set(nicknames) }
const roomUsers = {};

// Room Configuration: { roomName: { password: 'hashed_password' } }
const roomConfigs = {};

// Track which rooms+nicknames a socket is in for cleanup: { socketId: [{ room, nickname }] }
const socketRoomMap = {};

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.id}`);

        const emitRoomUsers = (room) => {
            if (roomUsers[room]) {
                io.to(room).emit('room_users_update', {
                    room,
                    users: Array.from(roomUsers[room])
                });
            }
        };

        socket.on('join_room', async (data) => {
            const { room, nickname, password, userColor } = data;

            // 1. Existing Private Room
            if (roomConfigs[room] && roomConfigs[room].password) {
                const isMatch = await bcrypt.compare(password, roomConfigs[room].password);
                if (!isMatch) {
                    socket.emit('join_error', { message: 'Incorrect password for this private room.' });
                    return;
                }
            }
            // 2. New Room (Create)
            else if (!roomUsers[room] || roomUsers[room].size === 0) {
                if (password) {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    roomConfigs[room] = { password: hashedPassword };
                    console.log(`Room ${room} created as Private (Encrypted).`);
                } else {
                    console.log(`Room ${room} created as Public.`);
                }
            }
            // 3. Existing Public Room
            else {
                if (password) {
                    socket.emit('join_error', { message: 'Room already exists and is Public. Join without password.' });
                    return;
                }
            }

            // Initialize room set if not exists
            if (!roomUsers[room]) {
                roomUsers[room] = new Set();
            }

            // Check if nickname exists
            if (roomUsers[room].has(nickname)) {
                socket.emit('join_error', { message: `Nickname "${nickname}" is already taken in room "${room}"` });
                return;
            }

            // Success: Add user
            roomUsers[room].add(nickname);

            // Track for this socket
            if (!socketRoomMap[socket.id]) {
                socketRoomMap[socket.id] = [];
            }
            socketRoomMap[socket.id].push({ room, nickname });

            socket.join(room);
            console.log(`User ${socket.id} joined room: ${room} as ${nickname}`);

            const isPrivate = !!(roomConfigs[room] && roomConfigs[room].password);

            // Emit success to the user who joined
            socket.emit('join_success', { room, nickname, userColor, isPrivate });

            // Fetch and emit Chat History
            try {
                const HistoryModel = isPrivate ? PrivateMessage : Message;
                const history = await HistoryModel.find({ room })
                    .sort({ createdAt: -1 })
                    .limit(50)
                    .sort({ createdAt: 1 });

                // Decrypt messages before sending to client
                const decryptedHistory = history.map(msg => {
                    const msgObj = msg.toObject();
                    msgObj.text = decrypt(msgObj.text);
                    return msgObj;
                });

                socket.emit('load_history', decryptedHistory);
            } catch (err) {
                console.error('Error fetching chat history:', err);
            }

            // Broadcast updated user list
            emitRoomUsers(room);

            // Broadcast to room
            socket.to(room).emit('receive_message', {
                _id: Date.now(),
                text: `${nickname} has joined the chat`,
                nickname: 'System',
                userColor: '#999',
                room,
                createdAt: new Date(),
                isSystem: true
            });
        });

        socket.on('send_message', async (data) => {
            const { room, nickname, text, userColor } = data;
            const sanitizedText = xss(text);

            // Encrypt text before saving
            const encryptedText = encrypt(sanitizedText);

            const isPrivate = !!(roomConfigs[room] && roomConfigs[room].password);
            const MsgModel = isPrivate ? PrivateMessage : Message;

            const newMessage = new MsgModel({
                nickname,
                text: encryptedText, // Save encrypted
                userColor,
                room
            });

            // Optimistic broadcast - send decrypted (original) text immediately
            const messageToEmit = {
                ...newMessage.toObject(),
                text: sanitizedText
            };

            io.to(room).emit('receive_message', messageToEmit);

            // Save asynchronously
            try {
                await newMessage.save();
            } catch (err) {
                console.error('Error saving message to DB:', err);
            }
        });

        socket.on('typing', (data) => {
            // data: { room, nickname, isTyping }
            socket.to(data.room).emit('display_typing', data);
        });

        socket.on('disconnecting', () => {
            // Cleanup users from rooms
            const userRooms = socketRoomMap[socket.id] || [];

            userRooms.forEach(({ room, nickname }) => {
                if (roomUsers[room]) {
                    roomUsers[room].delete(nickname);
                    // Broadcast updated user list
                    emitRoomUsers(room);
                }

                socket.to(room).emit('receive_message', {
                    _id: Date.now(),
                    text: `${nickname} has left the chat`,
                    nickname: 'System',
                    userColor: '#999',
                    room,
                    createdAt: new Date(),
                    isSystem: true
                });
            });

            // Clear socket map
            delete socketRoomMap[socket.id];
        });

        socket.on('disconnect', () => {
            console.log('User Disconnected', socket.id);
        });
    });
};

