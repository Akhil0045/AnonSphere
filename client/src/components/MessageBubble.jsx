import React from 'react';
import { useUser } from '../context/UserContext';
import DOMPurify from 'dompurify';
import { format } from 'date-fns';
import '../styles/Chat.css';

const MessageBubble = ({ message }) => {
    const { user } = useUser();
    const isSelf = message.nickname === user.nickname;
    const isSystem = message.isSystem;

    if (isSystem) {
        return (
            <div className="flex justify-center my-4">
                <span className="bg-gray-800 text-gray-400 text-xs py-1 px-3 rounded-full border border-gray-700">
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
                <div
                    className="user-avatar-sm"
                    style={{ backgroundColor: message.userColor }}
                >
                    {message.nickname.charAt(0).toUpperCase()}
                </div>
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

