import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaLock, FaHashtag } from 'react-icons/fa';
import '../styles/CreateRoomModal.css';

const CreateRoomModal = ({ isOpen, onClose, onCreate }) => {
    const [roomName, setRoomName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (roomName.trim()) {
            onCreate(roomName, isPrivate, password);
            // Reset fields
            setRoomName('');
            setIsPrivate(false);
            setPassword('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="modal-content"
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <h2>Create New Room</h2>
                        <button className="close-btn" onClick={onClose}>
                            <FaTimes />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="create-room-form">
                        <div className="form-group">
                            <label>Room Name</label>
                            <div className="input-wrapper">
                                <FaHashtag className="input-icon" />
                                <input
                                    type="text"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    placeholder="e.g. Chill Zone"
                                    autoFocus
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                />
                                <span className="toggle-text">Private Room</span>
                            </label>
                        </div>

                        {isPrivate && (
                            <motion.div
                                className="form-group"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                            >
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <FaLock className="input-icon" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Set a password"
                                        required={isPrivate}
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-create">
                                Create Room
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CreateRoomModal;
