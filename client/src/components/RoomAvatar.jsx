import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';

const GRADIENTS = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Violet
    'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', // Blue
    'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', // Emerald
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', // Orange
    'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', // Pink
];

const getHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
};

const RoomAvatar = ({ roomName, isPrivate }) => {
    const hash = Math.abs(getHash(roomName));
    const background = GRADIENTS[hash % GRADIENTS.length];

    // Use DiceBear Adventurer for "Anime/RPG" style characters
    // This style is very detailed and "cool"
    const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(roomName)}&backgroundColor=transparent`;

    return (
        <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
            {/* Main Avatar */}
            <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: background,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden', // Clip the image
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                border: '2px solid rgba(255,255,255,0.1)'
            }}>
                <img
                    src={avatarUrl}
                    alt={roomName}
                    style={{
                        width: '80%',
                        height: '80%',
                        objectFit: 'contain'
                    }}
                />
            </div>

            {/* Lock Badge for Private Rooms */}
            {isPrivate && (
                <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    background: '#1e293b', // Card bg
                    borderRadius: '50%',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                }}>
                    <div style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: '#ef4444',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: 'white'
                    }}>
                        <FaLock />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomAvatar;
