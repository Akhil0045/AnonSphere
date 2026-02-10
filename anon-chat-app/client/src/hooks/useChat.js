import { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useChatContext } from '../context/ChatContext';

const useChat = () => {
    const { user } = useUser();
    const {
        messagesByRoom,
        typingUsersByRoom,
        sendMessage,
        sendTyping,
        joinChatRoom,
        clearUnread
    } = useChatContext();

    const currentRoom = user.activeRoom;

    // Clear unread messages when we focus this room
    useEffect(() => {
        if (currentRoom) {
            clearUnread(currentRoom);
        }
    }, [currentRoom]);

    return {
        messages: messagesByRoom[currentRoom] || [],
        typingUsers: typingUsersByRoom[currentRoom] || [],
        sendMessage: (text) => sendMessage(text, currentRoom),
        sendTyping: (isTyping) => sendTyping(isTyping, currentRoom),
        joinChatRoom
    };
};

export default useChat;

