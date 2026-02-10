import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import useChat from '../hooks/useChat';
import useAutoScroll from '../hooks/useAutoScroll';
import Header from './Header';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Chat.css';
import '../styles/Sidebar.css';

const ChatRoom = () => {
    const { user } = useUser();
    const { messages, sendMessage, sendTyping, typingUsers } = useChat();
    const [inputText, setInputText] = useState('');
    const scrollRef = useAutoScroll(messages);

    const handleSend = (e) => {
        e.preventDefault();
        if (inputText.trim()) {
            sendMessage(inputText);
            setInputText('');
            sendTyping(false);
        }
    };

    const handleTyping = (e) => {
        setInputText(e.target.value);
        if (e.target.value.length > 0) {
            sendTyping(true);
        } else {
            sendTyping(false);
        }
    };

    // If no active room, show a placeholder
    const renderChatArea = () => {
        if (!user.activeRoom) {
            return (
                <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-900">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Welcome, {user.nickname}</h2>
                        <p>Select a room from the sidebar or creat a new one to start chatting.</p>
                    </div>
                </div>
            );
        }

        return (
            <motion.div
                key={user.activeRoom}
                className="chat-container flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                <Header
                    room={user.activeRoom}
                    nickname={user.nickname}
                    color={user.color}
                    isPrivate={user.roomTypes[user.activeRoom] === 'private'}
                />

                <div className="chat-messages">
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={`${user.activeRoom}-${idx}`}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MessageBubble message={msg} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={scrollRef} />
                </div>

                <div className="chat-input-area">
                    <TypingIndicator typingUsers={typingUsers} />
                    <form onSubmit={handleSend} className="input-form">
                        <input
                            type="text"
                            value={inputText}
                            onChange={handleTyping}
                            className="chat-input"
                            placeholder={`Message #${user.activeRoom}...`}
                            autoFocus
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="send-btn"
                        >
                            Send
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-900">
            <Sidebar isOpen={true} />
            {renderChatArea()}
        </div>
    );
};

export default ChatRoom;



