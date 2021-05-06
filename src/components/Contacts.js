import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ListGroup } from 'react-bootstrap';

function Contacts() {

    const { user } = useContext(AuthContext);

    return (
        <ListGroup variant="flush">
            {user.contacts.map(c => (
                <ListGroup.Item key={c._id}>
                    {c.username}
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}

export default Contacts
