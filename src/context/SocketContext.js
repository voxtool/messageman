import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import io from 'socket.io-client';

export const SocketContext = createContext();

function SocketContextProvider(props) {

    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState();

    useEffect(() => {
        if (!user) {
            return
        }
        const newSocket = io(process.env.REACT_APP_BACKEND, { query: { id: user?._id } });
        setSocket(newSocket);
        return () => newSocket.close();
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

export default SocketContextProvider
