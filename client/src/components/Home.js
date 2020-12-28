import React from 'react'
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import logo from '../assets/cs-logo.png';
import Landing from './Landing'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

function Home(props) {
    return (
        <div>
            <Container>
                <h1 style={{textAlign: "center", marginTop: 20}}>
                    Welcome to Centurian Systems
                </h1>
                {
                    props.auth.isAuthenticated 
                    ? <div>
                        <h1 style={{textAlign: 'center'}}>
                            Hey {props.auth.user.name} 👋
                        </h1>
                        <Image src={logo} style={{margin: '0 auto', display: 'block', marginTop: 20}} fluid rounded />
                    </div>
                    : <Landing />
                }
            </Container>
        </div>
    )
}

Home.propTypes = {
    auth: PropTypes.object.isRequired
};
  
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Home)

