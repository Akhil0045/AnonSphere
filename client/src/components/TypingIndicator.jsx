import React from 'react';
import '../styles/Chat.css';

const TypingIndicator = ({ typingUsers }) => {
    if (typingUsers.length === 0) return null;

    const text = typingUsers.length > 3
        ? 'Several people are typing...'
        : `${typingUsers.join(', ')} ${typingUsers.length === 1 ? 'is' : 'are'} typing...`;

    return (
        <div className="typing-indicator">
            <div className="dots-container">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
            <span>{text}</span>
        </div>
    );
};

export default TypingIndicator;

