import { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { SocketContext } from './SocketContext';

export const ConversationContext = createContext();

function ConversationContextProvider(props) {

    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(0);

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
                const newConversations = prevVal.map(c => {
                    if (c._id === conversationId) {
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
    }, [socket]);

    async function sendMessage(recipients, conversationId, text) {
        socket.emit('send-message', { recipients, message: { sender: user._id, text }, conversationId });
        return;
    }

    const formatted = conversations.map((conversation, index) => {
        const recipients = conversation.recipients.map(recipient => {
            const contact = user?.contacts.find(c => {
                return c._id === recipient;
            })
            const username = (contact && contact.username) || recipient;
            return { _id: recipient, username };
        })
        const messages = conversation.messages.map(m => {
            const contact = user?.contacts.find(c => {
                return c._id === m.sender;
            })
            const username = (contact && contact.username) || m.sender;
            const fromMe = user?._id === m.sender;
            return { ...m, senderName: username, fromMe }
        })
        const selected = index === selectedConversation
        return { ...conversation, messages, recipients, selected };
    })

    return (
        <ConversationContext.Provider value={{ conversations: formatted, createConversation, setSelectedConversation, conversation: formatted[selectedConversation], sendMessage }}>
            {props.children}
        </ConversationContext.Provider>
    )
}

export default ConversationContextProvider