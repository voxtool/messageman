import React, { useState, useContext } from 'react';
import { Tab, Nav, Button, Modal } from 'react-bootstrap';
import Contacts from './Contacts';
import Conversations from './Conversations';
import NewContactModal from './NewContactModal';
import NewConversationModal from './NewConversationModal';
import { AuthContext } from '../context/AuthContext';

const CONVERSATIONS_KEY = 'conversations';
const CONTACTS_KEY = 'contacts';

function Sidebar() {

    const { setUser, user } = useContext(AuthContext);
    const [active, setActive] = useState(CONVERSATIONS_KEY);
    const [show, setShow] = useState(false);
    const conversationsOpen = active === CONVERSATIONS_KEY;

    function closePopUp() {
        setShow(false);
    }

    async function logoutHandler() {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/users/logout`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                credentials: 'include',
                body: null
            })
            const userData = await response.json();
            setUser(null);
            return userData
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="d-flex flex-column" style={{ width: '25vw' }}>
            <Tab.Container activeKey={active} onSelect={(e) => setActive(e)} transition={false} unmountOnExit="true">
                <Nav variant="tabs" className="justify-content-center">
                    <Nav.Item>
                        <Nav.Link eventKey={CONVERSATIONS_KEY}>Conversations</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={CONTACTS_KEY}>Contacts</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content className="border-right overflow-auto flex-grow-1">
                    <Tab.Pane eventKey={CONVERSATIONS_KEY}>
                        <Conversations />
                    </Tab.Pane>
                    <Tab.Pane eventKey={CONTACTS_KEY}>
                        <Contacts />
                    </Tab.Pane>
                </Tab.Content>
                <div className="p-2 border-top border-right small">
                    <p>Username: <span className="text-muted">{user.username}</span> <Button variant="outline-danger" size="sm" onClick={logoutHandler}>Logout</Button></p>
                    <p>Id: <span className="text-muted">{user._id}</span></p>
                </div>
                <Button onClick={() => setShow(true)} className="rounded-0">New {conversationsOpen ? 'Conversation' : 'Contact'}</Button>
            </Tab.Container>
            <Modal show={show} onHide={closePopUp} animation={false}>
                {conversationsOpen ? <NewConversationModal  closePopUp={closePopUp}/> : <NewContactModal />}
            </Modal>
        </div>
    )
}

export default Sidebar
