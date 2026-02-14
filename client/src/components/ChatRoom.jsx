import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Toggle sidebar for mobile
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
                <div className="chat-main" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                    <div className="text-center p-4">
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome, {user.nickname}</h2>
                        <p>Select a room from the sidebar or create a new one to start chatting.</p>
                        <button
                            className="open-sidebar-btn"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            Open Room List
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <motion.div
                key={user.activeRoom}
                className="chat-main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                <Header
                    room={user.activeRoom}
                    nickname={user.nickname}
                    color={user.color}
                    isPrivate={user.roomTypes[user.activeRoom] === 'private'}
                    onBack={() => setIsSidebarOpen(true)}
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
                            <FaPaperPlane />
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        );
    };

    // Close sidebar when room selected on mobile
    const handleRoomSelect = () => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className={`chat-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <Sidebar
                isOpen={isSidebarOpen}
                onRoomSelect={handleRoomSelect}
            />
            {renderChatArea()}
        </div>
    );
};

export default ChatRoom;



