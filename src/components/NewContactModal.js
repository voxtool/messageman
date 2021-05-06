import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, InputGroup, FormControl, ListGroup } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

function NewContactModal() {

    const { user, setUser } = useContext(AuthContext);
    const [query, setQuery] = useState('');
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const timeId = setTimeout(() => setSearch(query), 500);
        return () => clearTimeout(timeId);
    }, [query]);

    useEffect(() => {
        setUsers([]);
    }, [search]);

    useEffect(() => {
        async function getUser(search) {
            if (search) {
                try {
                    const request = await fetch(`${process.env.REACT_APP_BACKEND}/users/search/${search}`, {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        method: "GET",
                        credentials: 'include',
                    });
                    const result = await request.json();
                    setUsers(result);
                    return;
                } catch (error) {
                    console.log(error)
                }
            }
        }
        getUser(search);
    }, [search]);

    async function manageContact(id, action) {
        try {
            const request = await fetch(`${process.env.REACT_APP_BACKEND}/users/${action}/${id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "GET",
                credentials: 'include',
            });
            const user = await request.json();
            setUser(user);
            return;
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Modal.Header closeButton>Add Contact</Modal.Header>
            <Modal.Body>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Search</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl type="text" value={query} onChange={(e) => setQuery(e.target.value)}></FormControl>
                </InputGroup>
                <ListGroup>
                    {users.map(u =>
                        <ListGroup.Item key={u._id} className="d-flex justify-content-between mt-2 mb-2" variant="flush">
                            {u.username}
                            {!user.contacts.some(el => el._id === u._id)
                                ? <Button size="sm" onClick={() => manageContact(u._id, 'add')}>Add</Button>
                                : <Button size="sm" variant="outline-danger" onClick={() => manageContact(u._id, 'remove')}>Remove</Button>
                            }
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Modal.Body>
        </>
    )
}

export default NewContactModal
