import React, { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { ConversationContext } from '../context/ConversationContext';

function Conversations() {

    const { user } = useContext(AuthContext);
    const { conversations, setSelectedConversation } = useContext(ConversationContext);

    return (
        <div>
            <ListGroup variant="flush">
                {conversations.map((c, index) => (
                    <ListGroup.Item key={c._id} action active={c.selected} onClick={() => setSelectedConversation(index)}>
                        {c.recipients.filter(rec => rec._id !== user._id).map(r => r.username).join(', ')}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    )
}

export default Conversations
