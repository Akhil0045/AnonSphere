import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useChatContext } from '../context/ChatContext';
import { FaHashtag, FaPlus, FaSignOutAlt, FaTimes, FaLock, FaSearch, FaFilter } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SHA256 from 'crypto-js/sha256';

import CreateRoomModal from './CreateRoomModal';
import RoomAvatar from './RoomAvatar';
import UserAvatar from './UserAvatar';

const Sidebar = ({ isOpen, onClose, onRoomSelect }) => {
    const { user, switchRoom, leaveRoom, joinRoom } = useUser();
    const { joinChatRoom, unreadCounts, onlineUsersByRoom } = useChatContext();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleCreateRoom = (roomName, isPrivate, password) => {
        // Hash password on client side so plain text isn't sent over network
        const finalPassword = isPrivate ? SHA256(password).toString() : null;

        if (user.joinedRooms.includes(roomName)) {
            toast.error('You are already in this room');
            return;
        }

        joinChatRoom(roomName, user.nickname, finalPassword, user.color);
        setIsCreateModalOpen(false);
    };

    const handleLeave = (room, e) => {
        e.stopPropagation();
        leaveRoom(room);
        toast.success(`Left ${room}`);
    };

    const handleRoomClick = (room) => {
        switchRoom(room);
        if (onRoomSelect) onRoomSelect();
    }

    const filteredRooms = user.joinedRooms.filter(room =>
        room.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h3>Your Rooms</h3>
                <div className="sidebar-actions">
                    <button
                        className="add-room-btn"
                        onClick={() => setIsCreateModalOpen(true)}
                        title="Create new room"
                    >
                        <FaPlus />
                    </button>
                </div>
            </div>

            <div className="search-bar-container" style={{ padding: '16px' }}>
                <div className="search-input-wrapper" style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-card)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <FaSearch style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }} />
                    <input
                        type="text"
                        placeholder="Search or start a new chat"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            marginLeft: '0.8rem',
                            flex: 1,
                            outline: 'none',
                            fontSize: '0.9rem'
                        }}
                    />
                    <FaFilter style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }} />
                </div>
            </div>

            <div className="room-list">
                {filteredRooms.map(room => (
                    <div key={room} className="room-wrapper">
                        <div
                            className={`room-item ${user.activeRoom === room ? 'active' : ''}`}
                            onClick={() => handleRoomClick(room)}
                        >
                            <div className="room-name">
                                <RoomAvatar
                                    roomName={room}
                                    isPrivate={user.roomTypes[room] === 'private'}
                                />
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

                        {/* Online users list removed as per user request */}
                    </div>
                ))}
            </div>

            <div className="user-profile">
                <UserAvatar nickname={user.nickname} />
                <div className="user-details">
                    <span className="user-nickname">{user.nickname}</span>
                    <span className="user-status">Online</span>
                </div>
            </div>

            <CreateRoomModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateRoom}
            />
        </div>
    );
};

export default Sidebar;
