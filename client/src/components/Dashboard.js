import React from 'react'
import Container from 'react-bootstrap/Container';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import MyNavbar from './Navbar';

function Dashboard(props) {
    console.log(props, 'PROPS')
    return (
        <div>
            <MyNavbar />
            <Container>
                <h1>Welcome Admin</h1>
            </Container>
        </div>
    )
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired
};
  
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Dashboard)

