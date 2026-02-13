import React from 'react';
import { useUser } from '../context/UserContext';
import DOMPurify from 'dompurify';
import { format } from 'date-fns';
import '../styles/Chat.css';
import UserAvatar from './UserAvatar';

const MessageBubble = ({ message }) => {
    const { user } = useUser();
    const isSelf = message.nickname === user.nickname;
    const isSystem = message.isSystem;

    if (isSystem) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                <span style={{
                    backgroundColor: '#1f2937',
                    color: '#9ca3af',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    border: '1px solid #374151'
                }}>
                    {message.text}
                </span>
            </div>
        );
    }

    const formattedTime = message.createdAt
        ? format(new Date(message.createdAt), 'HH:mm')
        : '';

    return (
        <div className={`message-wrapper ${isSelf ? 'self' : 'other'}`}>
            {!isSelf && (
                <UserAvatar nickname={message.nickname} size={32} />
            )}

            <div className="message-content">
                {!isSelf && (
                    <div className="message-header">
                        <span className="message-author">{message.nickname}</span>
                    </div>
                )}

                <div
                    className="message-bubble"
                    style={{
                        borderTopLeftRadius: !isSelf ? 0 : 12,
                        borderTopRightRadius: isSelf ? 0 : 12
                    }}
                >
                    <div
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(message.text)
                        }}
                    />
                </div>

                <span className="message-time">{formattedTime}</span>
            </div>
        </div>
    );

};

export default MessageBubble;

