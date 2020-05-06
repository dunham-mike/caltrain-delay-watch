import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { store } from '../../store/store';

import ErrorModal from '../../components/ErrorModal/ErrorModal';
import AuthorizationForm from './AuthorizationForm/AuthorizationForm';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const Authorization = (props) => {
    const [error, setError] = useState(null);

    const context = useContext(store);
    const { dispatch, state } = context;

    let formVersion = null;
    if(props.location.pathname === "/create-account") {
        formVersion = "CreateAccount";
    } else if(props.location.pathname === "/login") {
        formVersion = "Login";
    }

    let authRedirect = null;
    if(state.user) {
        authRedirect = <Redirect to={'/'} />
    }

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(backendUrl + '/api/auth/login',
                {
                    "user": {
                        "email": email,
                        "password": password
                    }
                })

            if(response.data.email && response.data.token) {
                const user = response.data.email;
                const token = response.data.token;
                dispatch({ type: 'LOG_IN_USER', user: user, token: token });
            } else {
                setError(response.data);
            }
        } catch(err) {
            console.log(err);
            setError(err);
        }
    }

    const loginSubmitHandler = async (values, { setSubmitting }) => {        
        await loginUser(values.email, values.password);
        setSubmitting(false);
    }

    const createAccount = async (email, password, preferredNotificationMethod, phoneNumber) => {
        const accountCreationBody = {
            "user": {
                "email": email,
                "password": password,
                "preferredNotificationMethod": preferredNotificationMethod
            }
        };

        if(preferredNotificationMethod === "sms") {
            accountCreationBody.user.phoneNumber = phoneNumber;
        }

        try {
            const response = await axios.post(backendUrl + '/api/auth/create-account', accountCreationBody);

            if(response.data === 'Account successfully created.') {
                // Small delay necessary for login request to resolve successfully
                await new Promise(resolve => setTimeout(resolve, 200));
                await loginUser(email, password);
            } else {
                setError(response.data);
                // setSubmitting(false);
            }
        } catch(err) {
            console.log(err);
            setError(err);
            // setSubmitting(false);
        }
    }

    const createAccountSubmitHandler = async (values, { setSubmitting }) => {
        await createAccount(values.email, values.password, values.preferredNotificationMethod, values.phoneNumber);
        setSubmitting(false);
        // const accountCreationBody = {
        //     "user": {
        //         "email": values.email,
        //         "password": values.password,
        //         "preferredNotificationMethod": values.preferredNotificationMethod
        //     }
        // };

        // if(values.preferredNotificationMethod === "sms") {
        //     accountCreationBody.user.phoneNumber = values.phoneNumber;
        // }

        // try {
        //     const response = await axios.post(backendUrl + '/api/auth/create-account', accountCreationBody);

        //     if(response.data === 'Account successfully created.') {
        //         // Small delay necessary for login request to resolve successfully
        //         await new Promise(resolve => setTimeout(resolve, 200));
        //         await loginUser(values.email, values.password, { setSubmitting });
        //     } else {
        //         setError(response.data);
        //         setSubmitting(false);
        //     }
        // } catch(err) {
        //     console.log(err);
        //     setError(err);
        //     setSubmitting(false);
        // }
    }

    const closeErrorModal = () => {
        setError(null);
    }
    
    return(
        <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '1.5rem 1.5rem' }}>
            {authRedirect}
            <ErrorModal isErrorModalActive={error !== null} errorMessage={error} closeErrorModal={closeErrorModal} />
            <AuthorizationForm 
                formVersion={formVersion}
                loginSubmitHandler={loginSubmitHandler}
                createAccountSubmitHandler={createAccountSubmitHandler}
            />
        </div>
    );
}

export default Authorization;