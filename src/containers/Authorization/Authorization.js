import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { store } from '../../store/store';
import { loginUser, createAccount } from '../../services/backendService';

import ErrorModal from '../../components/ErrorModal/ErrorModal';
import AuthorizationForm from './AuthorizationForm/AuthorizationForm';
import PageContainer from '../PageContainer/PageContainer';

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

    const loginSubmitHandler = async (values, { setSubmitting }) => {        
        const loginError = await loginUser(values.email, values.password, dispatch);
        if(loginError !== null) {
            if(loginError.message) {
                setError(loginError.message);
            } else {
                setError(loginError);
            }
        }
        setSubmitting(false);
    }

    const createAccountSubmitHandler = async (values, { setSubmitting }) => {
        const createAccountError = await createAccount(values.email, values.password, values.preferredNotificationMethod, values.phoneNumber, dispatch);
        if(createAccountError !== null) {
            setError(createAccountError);
        }
        setSubmitting(false);
    }

    const closeErrorModal = () => {
        setError(null);
    }
    
    return(
        <PageContainer>
            {authRedirect}
            <ErrorModal isErrorModalActive={error !== null} errorMessage={error} closeErrorModal={closeErrorModal} />
            <AuthorizationForm 
                formVersion={formVersion}
                loginSubmitHandler={loginSubmitHandler}
                createAccountSubmitHandler={createAccountSubmitHandler}
            />
        </PageContainer>
    );
}

export default Authorization;