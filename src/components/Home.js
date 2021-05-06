import React, { useContext } from 'react';
import { ConversationContext } from '../context/ConversationContext';
import OpenConversation from './OpenConversation';
import Sidebar from './Sidebar';

function Home() {

    const { conversation } = useContext(ConversationContext);

    return (
        <div className="d-flex" style={{ height: '100vh' }}>
            <Sidebar />
            {conversation && <OpenConversation />}
        </div>
    )
}

export default Home
