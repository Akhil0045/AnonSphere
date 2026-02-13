import { FaLock, FaGlobe, FaArrowLeft } from 'react-icons/fa';
import UserAvatar from './UserAvatar';

const Header = ({ room, nickname, color, isPrivate, onBack }) => {
    return (
        <div className="chat-header">
            <div className="header-logo">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="back-btn"
                        title="Back to rooms"
                    >
                        <FaArrowLeft />
                    </button>
                )}
                <div className="status-indicator"></div>
                <h1 className="header-title">AnonSphere</h1>
            </div>
            <div className="header-info">
                <div className="room-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isPrivate ? <FaLock color="#ef4444" /> : <FaGlobe color="#3b82f6" />}
                    <span className="room-id" style={{ color: isPrivate ? '#f87171' : 'inherit' }}>
                        {room} {isPrivate && '(Private)'}
                    </span>
                </div>
                <div className="user-badge">
                    <UserAvatar nickname={nickname} size={32} />
                    <span className="user-name">{nickname}</span>
                </div>
            </div>
        </div>
    );
};

export default Header;

