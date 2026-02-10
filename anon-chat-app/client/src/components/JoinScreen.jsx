import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useChatContext } from '../context/ChatContext';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import '../styles/JoinScreen.css';

const JoinScreen = () => {
    const { joinRoom } = useUser();
    const { joinChatRoom } = useChatContext();
    const socket = useSocket();
    const [nickname, setNickname] = useState('');
    const [room, setRoom] = useState('');
    const [activeTab, setActiveTab] = useState('public');
    const [password, setPassword] = useState('');

    const generateColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const handleJoin = (e) => {
        e.preventDefault();

        if (!nickname.trim()) {
            toast.error('Please enter a nickname');
            return;
        }

        if (!room.trim()) {
            toast.error('Please enter a Room ID');
            return;
        }

        const isPrivate = activeTab === 'private';

        if (isPrivate && !password.trim()) {
            toast.error('Please enter a Room Password');
            return;
        }

        const color = generateColor();

        // Pass details to ChatContext to initiate join. 
        // User state will be updated only upon 'join_success' event.
        joinChatRoom(room, nickname, isPrivate ? password : null, color);

    };

    return (
        <motion.div
            className="join-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
        >
            <div className="join-card">
                <h2 className="join-title">
                    Enter <span className="text-gradient">AnonSphere</span>
                </h2>

                <div className="join-tabs" style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        className={`tab-btn ${activeTab === 'public' ? 'active' : ''}`}
                        onClick={() => setActiveTab('public')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            background: 'transparent',
                            border: 'none',
                            color: activeTab === 'public' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            borderBottom: activeTab === 'public' ? '2px solid var(--accent-primary)' : 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.3s'
                        }}
                    >
                        Public Room
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'private' ? 'active' : ''}`}
                        onClick={() => setActiveTab('private')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            background: 'transparent',
                            border: 'none',
                            color: activeTab === 'private' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            borderBottom: activeTab === 'private' ? '2px solid var(--accent-primary)' : 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.3s'
                        }}
                    >
                        Private Room
                    </button>
                </div>

                <form onSubmit={handleJoin} className="join-form">
                    <div className="form-group">
                        <label>Nickname</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="form-input"
                            placeholder="GhostRider"
                            maxLength={15}
                        />
                    </div>

                    <div className="form-group">
                        <label>Room ID</label>
                        <input
                            type="text"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            className="form-input"
                            placeholder={activeTab === 'public' ? "The Void" : "Secret Base"}
                            maxLength={20}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'private' && (
                            <motion.div
                                key="password-field"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="form-group"
                            >
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="Secret Key"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn-primary btn-join"
                        disabled={!socket}
                        style={{ opacity: !socket ? 0.7 : 1, cursor: !socket ? 'not-allowed' : 'pointer' }}
                    >
                        {socket ? 'Join Chat' : 'Connecting...'}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};

export default JoinScreen;


