import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { useUser } from './UserContext';
import toast from 'react-hot-toast';

const ChatContext = createContext();

export const useChatContext = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
    const socket = useSocket();
    const { user, joinRoom, updateNickname } = useUser();

    // State: { [roomId]: [messages] }
    const [messagesByRoom, setMessagesByRoom] = useState({});

    // State: { [roomId]: [userNicknames] }
    const [typingUsersByRoom, setTypingUsersByRoom] = useState({});

    // State: { [roomId]: [onlineUserNicknames] }
    const [onlineUsersByRoom, setOnlineUsersByRoom] = useState({});

    // Unread counts: { [roomId]: number }
    const [unreadCounts, setUnreadCounts] = useState({});

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            const { room } = message;

            setMessagesByRoom((prev) => ({
                ...prev,
                [room]: [...(prev[room] || []), message]
            }));

            // If message is for a room we are not currently viewing, increment unread
            if (room !== user.activeRoom) {
                setUnreadCounts(prev => ({
                    ...prev,
                    [room]: (prev[room] || 0) + 1
                }));
            }
        };

        const handleTyping = (data) => {
            // data: { room, nickname, isTyping }
            const { room, nickname, isTyping } = data;

            setTypingUsersByRoom(prev => {
                const roomTyping = prev[room] || [];
                let newRoomTyping;

                if (isTyping) {
                    if (!roomTyping.includes(nickname)) {
                        newRoomTyping = [...roomTyping, nickname];
                    } else {
                        newRoomTyping = roomTyping;
                    }
                } else {
                    newRoomTyping = roomTyping.filter(u => u !== nickname);
                }

                return { ...prev, [room]: newRoomTyping };
            });
        };

        const handleRoomUsersUpdate = (data) => {
            const { room, users } = data;
            setOnlineUsersByRoom(prev => ({
                ...prev,
                [room]: users
            }));
        };

        const handleJoinSuccess = (data) => {
            const { room, nickname, userColor, isPrivate } = data;
            // Update User Context with confirmed data
            updateNickname(nickname, userColor);
            joinRoom(room, isPrivate);
            toast.success(`Joined ${isPrivate ? 'Private' : 'Public'} room: ${room}`);

            // Initialize empty message array if not exists
            setMessagesByRoom(prev => {
                if (!prev[room]) return { ...prev, [room]: [] };
                return prev;
            });
        };

        const handleJoinError = (data) => {
            toast.error(data.message);
        };

        const handleLoadHistory = (messages) => {
            if (!messages || messages.length === 0) return;
            const room = messages[0].room;
            setMessagesByRoom((prev) => ({
                ...prev,
                [room]: messages
            }));
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('display_typing', handleTyping);
        socket.on('room_users_update', handleRoomUsersUpdate);
        socket.on('join_success', handleJoinSuccess);
        socket.on('join_error', handleJoinError);
        socket.on('load_history', handleLoadHistory);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('display_typing', handleTyping);
            socket.off('room_users_update', handleRoomUsersUpdate);
            socket.off('join_success', handleJoinSuccess);
            socket.off('join_error', handleJoinError);
            socket.off('load_history', handleLoadHistory);
        };
    }, [socket, user.activeRoom, joinRoom, updateNickname]);

    const sendMessage = useCallback((text, room) => {
        if (!socket || !text.trim()) return;

        socket.emit('send_message', {
            room,
            nickname: user.nickname,
            text,
            userColor: user.color
        });
    }, [socket, user]);

    const sendTyping = useCallback((isTyping, room) => {
        if (!socket) return;
        socket.emit('typing', {
            room,
            nickname: user.nickname,
            isTyping
        });
    }, [socket, user]);

    const joinChatRoom = (room, nickname, password, userColor) => {
        if (!socket) return;
        socket.emit('join_room', { room, nickname, password, userColor });
    };

    const clearUnread = (room) => {
        setUnreadCounts(prev => ({ ...prev, [room]: 0 }));
    };

    return (
        <ChatContext.Provider value={{
            messagesByRoom,
            typingUsersByRoom,
            onlineUsersByRoom,
            sendMessage,
            sendTyping,
            joinChatRoom,
            unreadCounts,
            clearUnread
        }}>
            {children}
        </ChatContext.Provider>

    );
};
