import React, { useState } from "react";
import { Link, withRouter } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { registerUser } from '../../actions/authActions'
import { connect } from 'react-redux'
import { useEffect } from "react";
import PropTypes from 'prop-types'
import classnames from 'classnames'

const Register = (props) => {
    const [registerForm, setRegisterForm] = useState({
        name: "",
        email: "",
        password: "",
        password2: "",
        errors: {}
    })

    useEffect(() => {
        if (props.auth.isAuthenticated) {
            props.history.push('/products');
        }
    },[props])

    const handleFormChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        setRegisterForm({
            ...registerForm,
            [name]: value
        })
    }

    const handleFormSubmit = e => {
        e.preventDefault();
        const newUser = {
            name: registerForm.name,
            email: registerForm.email,
            password: registerForm.password,
            password2: registerForm.password2
        };

        props.registerUser(newUser, props.history)
    }

    const { errors } = registerForm;

    return (
        <Container>
              <h1 style={{marginTop: 20, textAlign: 'center'}}>Register</h1>
              <Form style={{
                          marginTop: 20,
                          padding: 20,
                          borderRadius: 10,
                          border: '1px solid gray'
                      }}
                onSubmit={handleFormSubmit}
              >
                  <Form.Group controlId="formBasicEmail">
                      <Form.Label>Name<span style={{color: "red"}}>*</span></Form.Label>
                      <Form.Control className={
                            classnames("", {invalid: errors.name})} 
                            onChange={handleFormChange} name="name" 
                            type="text" placeholder="Enter your name" 
                        />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                      <Form.Label>Email address<span style={{color: "red"}}>*</span></Form.Label>
                      <Form.Control className={
                          classnames("", {invalid: errors.email})} 
                          onChange={handleFormChange} 
                          name="email" type="email" 
                          placeholder="Enter email" />
                      <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                      </Form.Text>
                  </Form.Group>
  
                  <Form.Group controlId="formBasicPassword">
                      <Form.Label>Password<span style={{color: "red"}}>*</span></Form.Label>
                      <Form.Control className={
                          classnames("", {invalid: errors.email})} 
                          onChange={handleFormChange} 
                          name="password" type="password" 
                          placeholder="Password" />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                      <Form.Label>Confirm Password<span style={{color: "red"}}>*</span></Form.Label>
                      <Form.Control className={
                          classnames("", {invalid: errors.email})} 
                          onChange={handleFormChange} 
                          name="password2" type="password" 
                          placeholder="Confirm Password" />
                  </Form.Group>
  
                  <Form.Row>
                      <Button variant="primary" type="submit">
                          Submit
                      </Button>
                      <Form.Text style={{paddingLeft: 10}} className="text-muted">
                          Already have an account ? <Link to="/login">Login</Link> 
                      </Form.Text>
                  </Form.Row>
              </Form>
        </Container>
      );
}

Register.propsTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        errors: state.errors
    }
}

export default connect(mapStateToProps, { registerUser })(withRouter(Register))