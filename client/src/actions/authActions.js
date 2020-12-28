import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { store } from 'react-notifications-component'

import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from './types';

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
    .post("/register", userData)
    .then(res => {
        store.addNotification({
            title: `Success`,
            message: `Now login to your account.`,
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
        history.push("/login") // Redirect to login on successful register
    })
    .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    }))
}

// Login - Get user token
export const loginUser = userData => dispatch => {
    axios.post('/login', userData)
    .then(res => {
        // Save to localstorage

        // Set token to localStorage
        const { token } = res.data;
        localStorage.setItem('jwtToken', token);
        setAuthToken(token);

        store.addNotification({
            title: `Welcome`,
            message: `You are now successfully logged in.`,
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
        
        // Decode token to get userData
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded))
    })
    .catch(err => {
        let errorTitle = "Error"
        let errorMessage = "An Error occured"
        if (err.response.data) {
            if (err.response.data.emailnotfound) {
                errorTitle = err.response.data.emailnotfound;
                errorMessage = "This email is not registered with us."
            }

            if (err.response.data.passwordincorrect) {
                errorTitle = err.response.data.passwordincorrect;
                errorMessage = "Please enter the correct password."
            }
        }
        store.addNotification({
            title: `${errorTitle}`,
            message: `${errorMessage}`,
            type: "danger",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
        });
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    })
}

// Set Logged in User
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

// User Loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    }
}

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem('jwtToken');

    // Remove auth header for future requests
    setAuthToken(false);

    // Set current user to empty object {} 
    // which will set isAuthenticated false
    dispatch(setCurrentUser({}))
}