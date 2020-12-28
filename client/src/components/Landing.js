import React from "react";
import { useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';

const Landing = () => {
  const history = useHistory()
  
  const goToRegister = () => {
    history.push('/register');
  }

  const goToLogin = () => {
    history.push('/login');
  }

    return (
      <Container style={{width: 250, marginTop: 20}}>
        <Row style={{textAlign: 'center', display: 'block'}}>
          <Button style={{float: 'left'}} onClick={goToRegister}>Register</Button>
          <Button style={{float: 'right'}} onClick={goToLogin}>Login</Button>
        </Row>
      </Container>
    );
}
export default Landing;