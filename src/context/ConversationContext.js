import { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { SocketContext } from './SocketContext';
import useLocalStorage from './useLocalStorage';

export const ConversationContext = createContext();

function ConversationContextProvider(props) {

    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState();
    const [notificationIds, setNotificationIds] = useLocalStorage('notifications', []);

    async function getAllConversations() {
        try {
            const request = await fetch(`${process.env.REACT_APP_BACKEND}/conversations/all`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "GET",
                credentials: 'include'
            });
            const response = await request.json();
            setConversations(response);
            return
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user) {
            getAllConversations();
        }
    }, [user]);

    function select(index) {
        setNotificationIds(prevVal => {
            const newIndexes = prevVal.filter(el => el !== index);
            return newIndexes;
        })
        setSelectedConversation(index);
    }

    async function createConversation(data) {
        const recipients = [...data, user._id];
        socket.emit('create-conversation', recipients);
    }

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on('receive-message', ({ message, conversationId }) => {
            setConversations(prevVal => {
                const newConversations = prevVal.map((c, index) => {
                    if (c._id === conversationId) {
                        setNotificationIds(prevVal => [...prevVal, index]);
                        return { ...c, messages: [...c.messages, message] };
                    }
                    return c;
                });
                return newConversations;
            });
        });
        socket.on('new-conversation', (conversation) => {
            setConversations(prevVal => [...prevVal, conversation]);
        })
        return () => socket.off('receive-message');
    }, [socket, setNotificationIds]);

    async function sendMessage(recipients, conversationId, text) {
        socket.emit('send-message', { recipients, message: { sender: user._id, text }, conversationId });
        return;
    }

    if (notificationIds.includes(selectedConversation)) {
        setNotificationIds(prevVal => {
            const newIndexes = prevVal.filter(el => el !== selectedConversation);
            return newIndexes;
        })
    }

    const formatted = conversations.map((conversation, index) => {
        const recipients = conversation.recipients.map(recipient => {
            const contact = user?.contacts.find(c => {
                return c._id === recipient;
            });
            const username = (contact && contact.username) || recipient;
            return { _id: recipient, username };
        });
        const messages = conversation.messages.map(m => {
            const contact = user?.contacts.find(c => {
                return c._id === m.sender;
            });
            const username = (contact && contact.username) || m.sender;
            const fromMe = user?._id === m.sender;
            return { ...m, senderName: username, fromMe }
        });
        const selected = index === selectedConversation;
        const isRead = !notificationIds.includes(index) || conversation.messages.length === 0;
        return { ...conversation, messages, recipients, selected, isRead };
    });

    return (
        <ConversationContext.Provider value={{ conversations: formatted, createConversation, select, conversation: formatted[selectedConversation], sendMessage }}>
            {props.children}
        </ConversationContext.Provider>
    )
}

export default ConversationContextProvider