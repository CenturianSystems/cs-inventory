import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { FaUserCircle} from 'react-icons/fa'
// import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import setAuthToken from "../utils/setAuthToken";
import { setCurrentUser } from "../actions/authActions";
import { store } from 'react-notifications-component'

const logout = () => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false)
    setCurrentUser({})
    window.location.href = "/login"
    store.addNotification({
        title: `Success`,
        message: `You are now successfully logged out.`,
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
    });
}

function MyNavbar(props) {
    console.log(props.auth)
    return (
        <div>
            <Navbar bg="dark" sticky="top" expand="lg" variant="dark">
                <Navbar.Brand href="/">Centurian Systems</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/products">Products</Nav.Link>
                        <Nav.Link disabled={!props.auth.isAuthenticated} href="/sales">Sales</Nav.Link>
                        <Nav.Link disabled={!props.auth.isAuthenticated} href="/purchases">Purchase</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href="/dashboard" style={{display: `${props.auth.user.isAdmin ? 'block' : 'none'}`}}>Dashboard</Nav.Link>
                        <DropdownButton
                            rootCloseEvent="click"
                            variant="secondary"
                            menuAlign={{ lg: 'right' }}
                            title={<FaUserCircle color="white" size="25" />}
                            id="dropdown-menu-align-responsive-1"
                        >
                            
                            <Dropdown.ItemText>Hi {props.auth.user.name ? props.auth.user.name : "Guest"} 👋</Dropdown.ItemText>
                            <Dropdown.Divider></Dropdown.Divider>
                            {
                                props.auth.isAuthenticated 
                                ? <> 
                                    <Dropdown.Item onClick={() => alert('This is yet to be implemented.')}>Edit Profile</Dropdown.Item>
                                    <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                                </>
                                : <Dropdown.Item href="/login">Login</Dropdown.Item>
                            }
                        </DropdownButton>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

MyNavbar.propTypes = {
    auth: PropTypes.object.isRequired
};
  
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(MyNavbar)
    