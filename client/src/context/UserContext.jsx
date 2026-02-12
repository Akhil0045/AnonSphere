import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        nickname: '',
        color: '#ffffff',
        joinedRooms: [], // Array of strings (room names)
        activeRoom: null,
        roomTypes: {} // { [roomName]: 'public' | 'private' }
    });

    const updateNickname = (nickname, color) => {
        setUser(prev => ({ ...prev, nickname, color }));
    };

    const joinRoom = (roomName, isPrivate) => {
        setUser(prev => {
            const roomType = isPrivate ? 'private' : 'public';
            if (prev.joinedRooms.includes(roomName)) {
                return {
                    ...prev,
                    activeRoom: roomName,
                    roomTypes: { ...prev.roomTypes, [roomName]: roomType }
                };
            }
            return {
                ...prev,
                joinedRooms: [...prev.joinedRooms, roomName],
                activeRoom: roomName,
                roomTypes: { ...prev.roomTypes, [roomName]: roomType }
            };
        });
    };

    const switchRoom = (roomName) => {
        setUser(prev => ({ ...prev, activeRoom: roomName }));
    };

    const leaveRoom = (roomName) => {
        setUser(prev => {
            const newRooms = prev.joinedRooms.filter(r => r !== roomName);
            const newActive = prev.activeRoom === roomName
                ? (newRooms[0] || null)
                : prev.activeRoom;

            return {
                ...prev,
                joinedRooms: newRooms,
                activeRoom: newActive
            };
        });
    };

    return (
        <UserContext.Provider value={{
            user,
            updateNickname,
            joinRoom,
            switchRoom,
            leaveRoom
        }}>
            {children}
        </UserContext.Provider>
    );
};

