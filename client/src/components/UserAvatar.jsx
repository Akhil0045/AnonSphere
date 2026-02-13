import React from 'react';

const UserAvatar = ({ nickname, size = 40, className = '' }) => {
    // Determine background color based on nickname hash for consistency if needed, 
    // or just use a standard one. For Anime avatars, a transparent or light bg usually looks best.

    // DiceBear 'adventurer' style
    const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(nickname)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

    return (
        <div
            className={`user-avatar-component ${className}`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-input)', // Fallback bg
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '2px solid rgba(255,255,255,0.1)'
            }}
        >
            <img
                src={avatarUrl}
                alt={nickname}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
        </div>
    );
};

export default UserAvatar;
