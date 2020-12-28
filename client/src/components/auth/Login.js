import React, { useState } from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, withRouter } from "react-router-dom";
import { useEffect } from "react";
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux'
import { loginUser } from '../../actions/authActions'

const Login = (props) => {
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
        errors: {}
    })

    useEffect(() => {
        if (props.auth.isAuthenticated) {
            props.history.push('/products');
        }
    }, [props])

    const handleFormChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        setLoginForm({
            ...loginForm,
            [name]: value
        })
    };

    const handleFormSubmit = e => {
        e.preventDefault();
        const loginUser = {
            email: loginForm.email,
            password: loginForm.password
        }

        props.loginUser(loginUser, props.history)
    }

    const { errors } = loginForm;
   
    return (
        <Container>
            <h1 style={{marginTop: 20, textAlign: 'center'}}>Login</h1>
            <Form style={{
                        marginTop: 20,
                        padding: 20,
                        borderRadius: 10,
                        border: '1px solid gray'
                    }}
                onSubmit={handleFormSubmit}
            >
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address<span style={{color: "red"}}>*</span></Form.Label>
                    <Form.Control className={
                            classnames("", {
                                invalid: errors.email || errors.emailnotfound
                            })}
                            onChange={handleFormChange} name="email" type="email" placeholder="Enter email" />
                    <span className="red-text">
                        {errors.email}
                        {errors.emailnotfound}
                    </span>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password<span style={{color: "red"}}>*</span></Form.Label>
                    <Form.Control 
                        className={classnames("", {
                            invalid: errors.password || errors.passwordincorrect
                        })}
                        onChange={handleFormChange} name="password" type="password" placeholder="Password" />
                    <span className="red-text">
                        {errors.password}
                        {errors.passwordincorrect}
                    </span>
                </Form.Group>

                <Form.Row>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <Form.Text style={{paddingLeft: 10}} className="text-muted">
                        Don't have an account ? <Link to="/register">Register</Link> 
                    </Form.Text>
                </Form.Row>
            </Form>
        </Container>
    );
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        errors: state.errors
    }
}

export default connect(mapStateToProps, { loginUser })(withRouter(Login))