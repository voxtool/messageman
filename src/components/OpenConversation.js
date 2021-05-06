import React, { useState, useContext, useCallback } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { ConversationContext } from '../context/ConversationContext';

function OpenConversation() {

    const { sendMessage, conversation } = useContext(ConversationContext);
    const lastMessage = useCallback(el => {
        if (el) {
            el.scrollIntoView({ smooth: true });
        }
    }, []);
    const [text, setText] = useState('');

    function submitMessage(e) {
        e.preventDefault();
        sendMessage(conversation.recipients.map(r => r._id), conversation._id, text);
        setText('');
    }

    return (
        <div className="d-flex flex-column flex-grow-1">
            <div className="flex-grow-1 overflow-auto">
                <div className="d-flex flex-column align-items-start justify-content-end px-3">
                    {conversation.messages.map((message, index) => {
                        const last = conversation.messages.length - 1 === index;
                        return (
                            <div ref={last ? lastMessage : null} key={index} className={`my-1 d-flex flex-column ${message.fromMe ? 'align-self-end align-items-end' : 'align-items-start'}`}>
                                <div className={`rounded px-2 py-1 ${message.fromMe ? 'bg-primary text-white' : 'border'}`}>
                                    {message.text}
                                </div>
                                <div className={`text-muted small ${message.fromMe ? 'text-right' : ''}`}>
                                    {message.fromMe ? 'You' : message.senderName}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Form onSubmit={submitMessage}>
                <Form.Group className="m-2">
                    <InputGroup>
                        <Form.Control as="textarea" required value={text} onChange={e => setText(e.target.value)} style={{ height: '75px', resize: 'none' }} />
                        <InputGroup.Append>
                            <Button type="submit">Send</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </Form>
        </div>
    )
}

export default OpenConversation
