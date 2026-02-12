import { FaLock, FaGlobe } from 'react-icons/fa';

const Header = ({ room, nickname, color, isPrivate }) => {
    return (
        <div className="chat-header">
            <div className="header-logo">
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
                    <div
                        className="user-color-dot"
                        style={{ backgroundColor: color }}
                    ></div>
                    <span className="user-name">{nickname}</span>
                </div>
            </div>
        </div>
    );
};

export default Header;

