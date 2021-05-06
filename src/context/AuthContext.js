import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

function AuthContextProvider(props) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function initialUser() {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND}/users/profile`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "GET",
                    credentials: 'include'
                });
                const userData = await response.json();
                userData.message ? setUser(null) : setUser(userData)
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        if (!user) {
            initialUser();
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider