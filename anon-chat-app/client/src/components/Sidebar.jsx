import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useChatContext } from '../context/ChatContext';
import { FaHashtag, FaPlus, FaSignOutAlt, FaTimes, FaLock } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, switchRoom, leaveRoom, joinRoom } = useUser();
    const { joinChatRoom, unreadCounts, onlineUsersByRoom } = useChatContext();
    const [isJoining, setIsJoining] = useState(false);
    const [newRoom, setNewRoom] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState('');

    const handleJoinNewRoom = (e) => {
        e.preventDefault();
        if (newRoom.trim()) {
            if (user.joinedRooms.includes(newRoom)) {
                toast.error('You are already in this room');
                return;
            }
            if (isPrivate && !password.trim()) {
                toast.error('Password required');
                return;
            }

            joinChatRoom(newRoom, user.nickname, isPrivate ? password : null, user.color);
            setNewRoom(''); // Reset
            setIsPrivate(false);
            setPassword('');
            setIsJoining(false);

        }
    };

    const handleLeave = (room, e) => {
        e.stopPropagation();
        leaveRoom(room);
        toast.success(`Left ${room}`);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h3>Your Rooms</h3>
                <button
                    className="add-room-btn"
                    onClick={() => setIsJoining(!isJoining)}
                    title="Join new room"
                >
                    <FaPlus />
                </button>
            </div>

            <AnimatePresence>
                {isJoining && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleJoinNewRoom}
                        className="new-room-form"
                        style={{ flexDirection: 'column', gap: '0.5rem' }}
                    >
                        <input
                            type="text"
                            value={newRoom}
                            onChange={(e) => setNewRoom(e.target.value)}
                            placeholder="Room Name..."
                            className="new-room-input"
                            autoFocus
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <input
                                type="checkbox"
                                id="sbPrivate"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                            />
                            <label htmlFor="sbPrivate" style={{ cursor: 'pointer' }}>Private</label>
                        </div>
                        {isPrivate && (
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="new-room-input"
                                style={{ fontSize: '0.8rem' }}
                            />
                        )}
                        <button type="submit" style={{ display: 'none' }}></button>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="room-list">
                {user.joinedRooms.map(room => (
                    <div key={room} className="room-wrapper">
                        <div
                            className={`room-item ${user.activeRoom === room ? 'active' : ''}`}
                            onClick={() => switchRoom(room)}
                        >
                            <div className="room-name">
                                {user.roomTypes[room] === 'private' ? <FaLock className="room-icon" style={{ color: '#ef4444' }} /> : <FaHashtag className="room-icon" />}
                                <span>{room}</span>
                            </div>
                            <div className="room-actions">
                                <span className="online-count">
                                    {(onlineUsersByRoom[room]?.length || 0)} online
                                </span>
                                {unreadCounts[room] > 0 && (
                                    <span className="unread-badge">{unreadCounts[room]}</span>
                                )}
                                <button
                                    className="leave-btn"
                                    onClick={(e) => handleLeave(room, e)}
                                    title="Leave room"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {user.activeRoom === room && onlineUsersByRoom[room] && (
                                <motion.div
                                    className="room-users"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                >
                                    {onlineUsersByRoom[room].map(nickname => (
                                        <div key={nickname} className="room-user-item">
                                            <div className="user-dot"></div>
                                            <span>{nickname === user.nickname ? 'You' : nickname}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            <div className="user-profile">
                <div className="user-avatar" style={{ backgroundColor: user.color }}></div>
                <div className="user-details">
                    <span className="user-nickname">{user.nickname}</span>
                    <span className="user-status">Online</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
