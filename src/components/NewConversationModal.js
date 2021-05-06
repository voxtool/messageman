import React, { useContext, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { ConversationContext } from '../context/ConversationContext';

function NewConversationModal(props) {

    const { user } = useContext(AuthContext);
    const { createConversation } = useContext(ConversationContext);
    const [selectedContacts, setSelectedContacts] = useState([]);

    function handleContacts(id) {
        setSelectedContacts(prevVal => {
            if (prevVal.includes(id)) {
                return prevVal.filter(prevId => {
                    return id !== prevId
                })
            } else {
                return [...prevVal, id]
            }
        })
    }

    async function onSubmitConversation(e) {
        e.preventDefault();
        createConversation(selectedContacts);
        props.closePopUp();
    }

    return (
        <>
            <Modal.Header closeButton>Create Conversation</Modal.Header>
            <Modal.Body>
                <Form onSubmit={onSubmitConversation}>
                    {user.contacts.map(c => (
                        <Form.Group controlId={c._id} key={c._id}>
                            <Form.Check type="checkbox" value={selectedContacts.includes(c._id)} label={c.username} onChange={() => handleContacts(c._id)} />
                        </Form.Group>
                    ))}
                    <Button type="submit">Create</Button>
                </Form>
            </Modal.Body>
        </>
    )
}

export default NewConversationModal
