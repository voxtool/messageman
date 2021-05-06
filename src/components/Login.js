import React, { useState, useContext } from 'react';
import { Form, Button, Tab, Nav } from 'react-bootstrap';
import { useFormik } from 'formik';
import { AuthContext } from '../context/AuthContext';

const LOGIN_KEY = 'login';
const REGISTER_KEY = 'register';


function Login() {
    const { setUser } = useContext(AuthContext);
    const [active, setActive] = useState(LOGIN_KEY);
    const [error, setError] = useState('');

    async function userHandler(data, endpoint) {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/users/${endpoint.toLowerCase()}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(data)
            })
            if (response.ok === false) {
                const error = await response.json();
                setError(error.message);
                return
            }
            const userData = await response.json();
            return userData.message ? setUser(null) : setUser(userData)
        } catch (error) {
            console.log(error.message);
        }
    }

    const validate = values => {
        const errors = {};

        if (!values.username) {
            errors.username = 'Required';
        } else if (!/^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(values.username)) {
            errors.username = 'Invalid Username';
        }

        if (!values.password) {
            errors.password = 'Required';
        } else if (values.password.length < 8) {
            errors.password = 'Must be 8 characters or more';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g.test(values.password)) {
            errors.password = 'One uppercase letter, one lowercase letter, one number and one special character'
        }

        return errors;
    };

    const registerFormik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validate,
        onSubmit: values => {
            userHandler({ username: values.username, password: values.password }, active);
        },
    })

    const loginFormik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validate,
        onSubmit: values => {
            userHandler({ username: values.username, password: values.password }, active);
        },
    })

    return (
        <div className="align-items-center justify-content-center d-flex flex-column text-center" style={{ height: '100vh' }}>
            <h2 className="mb-4">Welcome To Messageman</h2>
            <Tab.Container activeKey={active} onSelect={(k) => setActive(k)} transition={false} unmountOnExit="true">
                <Nav variant="tabs" className="justify-content-center">
                    <Nav.Item>
                        <Nav.Link eventKey={LOGIN_KEY}>Login</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={REGISTER_KEY}>Register</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey={LOGIN_KEY}>
                        <Form onSubmit={loginFormik.handleSubmit}>
                            {error ? <div className="text-danger">{error}</div> : null}
                            <Form.Group className="m-2">
                                <Form.Label>Enter Your Username</Form.Label>
                                <Form.Control type="text" name="username" onChange={loginFormik.handleChange} onBlur={loginFormik.handleBlur} value={loginFormik.values.username} placeholder="Username" />
                                {loginFormik.touched.username && loginFormik.errors.username ? <div className="small text-danger">{loginFormik.errors.username}</div> : null}
                            </Form.Group>
                            <Form.Group className="m-2">
                                <Form.Label>Enter Your Password</Form.Label>
                                <Form.Control type="password" name="password" onChange={loginFormik.handleChange} onBlur={loginFormik.handleBlur} value={loginFormik.values.password} placeholder="Password" />
                                {loginFormik.touched.password && loginFormik.errors.password ? <div className="small text-danger">{loginFormik.errors.password}</div> : null}
                            </Form.Group>
                            <Button type="submit">Login</Button>
                        </Form>
                    </Tab.Pane>
                    <Tab.Pane eventKey={REGISTER_KEY}>
                        <Form onSubmit={registerFormik.handleSubmit}>
                        {error ? <div className="text-danger">{error}</div> : null}
                            <Form.Group className="m-2">
                                <Form.Label>Enter Your Username</Form.Label>
                                <Form.Control type="text" name="username" onChange={registerFormik.handleChange} onBlur={registerFormik.handleBlur} value={registerFormik.values.username} placeholder="Username" />
                                {registerFormik.touched.username && registerFormik.errors.username ? <div className="small text-danger">{registerFormik.errors.username}</div> : null}
                            </Form.Group>
                            <Form.Group className="m-2">
                                <Form.Label>Enter Your Password</Form.Label>
                                <Form.Control type="password" name="password" onChange={registerFormik.handleChange} onBlur={registerFormik.handleBlur} value={registerFormik.values.password} placeholder="Password" />
                                {registerFormik.touched.password && registerFormik.errors.password ? <div className="small text-danger">{registerFormik.errors.password}</div> : null}
                            </Form.Group>
                            <Button type="submit">Register</Button>
                        </Form>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    )
}

export default Login
