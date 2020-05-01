import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { store } from '../../store/store';
import styled from 'styled-components';
import PhoneInput from "react-phone-number-input/input";

import AuthorizationErrorModal from '../../components/AuthorizationErrorModal/AuthorizationErrorModal';

const RadioLabel = styled.label`
    &:hover { color: white; };
`

export const AuthorizationForm = (props) => {
    const [error, setError] = useState(null);

    const context = useContext(store);
    const { dispatch, state } = context;

    let componentVersion = null;
    if(props.location.pathname === "/create-account") {
        componentVersion = "CreateAccount";
    } else if(props.location.pathname === "/login") {
        componentVersion = "Login";
    }

    let authRedirect = null;
    if(state.user) {
        authRedirect = <Redirect to={'/'} />
    }

    const loginUser = async (email, password, { setSubmitting }) => {
        try {
            const response = await axios.post('http://localhost:8082/api/auth/login',
                {
                    "user": {
                        "email": email,
                        "password": password
                    }
                })

            if(response.data.email && response.data.token) {
                dispatch({ type: 'LOG_IN_USER', user: response.data.email, token: response.data.token });
            } else {
                setError(response.data);
                setSubmitting(false);
            }
        } catch(err) {
            console.log(err);
            setError(err);
            setSubmitting(false);
        }
    }

    const loginSubmitHandler = async (values, { setSubmitting }) => {
        console.log('loginSubmitHandler() fired!');
        console.log(values);
        
        await loginUser(values.email, values.password, { setSubmitting });
    }

    const createAccountSubmitHandler = async (values, { setSubmitting }) => {
        console.log('createAccountSubmitHandler() fired!');
        console.log(values);
        try {
            const response = await axios.post('http://localhost:8082/api/auth/create-account',
                {
                    "user": {
                        "email": values.email,
                        "password": values.password
                    }
                })
            console.log('response:', response);

            if(response.data === 'Account successfully created.') {
                // Small delay necessary for login request to resolve successfully
                await new Promise(resolve => setTimeout(resolve, 200));
                await loginUser(values.email, values.password, { setSubmitting });
            } else {
                setError(response.data);
                setSubmitting(false);
            }
        } catch(err) {
            console.log(err);
            setError(err);
            setSubmitting(false);
        }
    }

    const closeAuthorizationErrorModal = () => {
        setError(null);
    }

    // let notificationFields = null;

    let validationSchema = {
        email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
        password: Yup.string()
            .min(6, 'Must be 6 characters or more')
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
    };

    let initialValues = { email: '', password: '' };

    if(componentVersion === 'CreateAccount') {
        initialValues.preferredNotificationMethod = 'sms';
        initialValues.tel = '';

        validationSchema.preferredNotificationMethod = Yup.string().required('Required');

        const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

        validationSchema.tel = Yup.string()
            .when('preferredNotificationMethod', {
                is: 'sms',
                then: Yup.string()
                    .min(12, 'Must be a valid US phone number')
                    .max(12, 'Must be a valid US phone number')
                    .required('Required')
            });

        console.log('validationSchema:', validationSchema);
    }
    
    return(
        <div className="has-text-white" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '1.5rem 1.5rem' }}>
            {authRedirect}
            <AuthorizationErrorModal isAuthorizationErrorModalActive={error !== null} errorMessage={error} closeAuthorizationErrorModal={closeAuthorizationErrorModal} />
            <div className="is-size-5 has-text-weight-bold" style={{ display: 'flex', justifyContent: 'center' }}>
                <div>{componentVersion === 'CreateAccount' ? 'Create Account' : 'Log In'}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object().shape(validationSchema)}
                    onSubmit={
                        componentVersion === 'CreateAccount'
                        ? (values, { setSubmitting }) => { createAccountSubmitHandler(values, { setSubmitting })}
                        : (values, { setSubmitting }) => { loginSubmitHandler(values, { setSubmitting })}
                    }
                >
                    {({ isSubmitting, isValid, dirty, touched, handleChange, handleBlur, values }) => (
                        <Form>
                            <div className="field" style={{ marginTop: '0.75rem', minWidth: '300px' }}>
                                <label className="label has-text-white">
                                    Email:
                                </label>
                                <Field type="email" name="email" className="input" />
                                <ErrorMessage name="email" component="div" className="has-text-primary" style={{ marginTop: '0.375rem', paddingLeft: '0.375rem' }} />
                            </div>
                            <div className="field" style={{ marginTop: '0.75rem', minWidth: '300px' }}>
                                <label className="label has-text-white">
                                    Password:
                                </label>
                                <Field type="password" name="password" className="input" />
                                <ErrorMessage name="password" component="div" className="has-text-primary" style={{ marginTop: '0.375rem', paddingLeft: '0.375rem' }} />
                            </div>
                            
                            {(  componentVersion === 'CreateAccount'
                                ?
                                    <React.Fragment>
                                        <label className="label has-text-white">
                                            Preferred Notification Method:
                                        </label>
                                        <Field name="preferredNotificationMethod" className="control">
                                            {({ field }) => (
                                                <>
                                                    <div className="control has-text-white"
                                                        style={{ paddingLeft: '0.375rem' }}
                                                        // style={{ display: 'flex', justifyContent: 'center' }}
                                                    >
                                                        <RadioLabel className="radio">
                                                            <input
                                                                {...field}
                                                                id="sms"
                                                                value="sms"
                                                                checked={field.value === 'sms'}
                                                                name="preferredNotificationMethod"
                                                                type="radio"
                                                                style={{ marginRight: '0.375rem' }}
                                                            />
                                                            Text Message
                                                        </RadioLabel>
                                                        <RadioLabel className="radio">
                                                            <input
                                                                {...field}
                                                                onChange={(value) => { 
                                                                    values['tel'] = '';
                                                                    field.onChange(value); 
                                                                }}
                                                                id="web app"
                                                                value="web app"
                                                                name="preferredNotificationMethod"
                                                                checked={field.value === 'web app'}
                                                                type="radio"
                                                                style={{ marginRight: '0.375rem' }}
                                                            />
                                                            Web App Only
                                                        </RadioLabel>
                                                    </div>
                                                </>
                                            )}
                                        </Field>
                                        {(  values['preferredNotificationMethod'] === "sms" 
                                            ?   <div className="field" style={{ marginTop: '0.75rem', minWidth: '300px' }}>
                                                    <label className="label has-text-white">
                                                        Cell Number:
                                                    </label>
                                                    <Field type="input" name="tel" id="tel">
                                                        {({ field }) => (                                
                                                            <PhoneInput
                                                                className="input"
                                                                country="US"
                                                                onChange={handleChange(field.name)}
                                                                onBlur={handleBlur(field.name)}
                                                                maxLength="16"
                                                            />
                                                        )}
                                                    </Field>
                                                    <ErrorMessage name="tel" component="div" className="has-text-primary" style={{ marginTop: '0.375rem', paddingLeft: '0.375rem' }} />
                                                </div>
                                            :   null )}
                                    </React.Fragment>
                                :   null
                            )}

                            <div className="field" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                                <button 
                                    className={"button is-outlined " + 
                                        ((
                                            !isValid || !dirty || isSubmitting || !touched['email'] 
                                            // || !touched['phoneNumber']
                                        ) 
                                        ? "is-light" 
                                        : "is-success")
                                    }
                                    disabled={
                                        !isValid 
                                        || !dirty 
                                        || isSubmitting 
                                        || !touched['email']
                                        // || !touched['phoneNumber']
                                        // || !touched['password'] // Don't check this, so that submit button will activate once minimum password length reached
                                    }
                                    type="submit"
                                >
                                    {componentVersion === 'CreateAccount' ? 'Create Account' : 'Log In'}
                                </button>
                            </div>
                            <div className="field" style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                                {componentVersion === 'CreateAccount' 
                                    ? <RouterLink to="/login" className="has-text-info">Need to log in instead?</RouterLink> 
                                    : <RouterLink to="/create-account" className="has-text-info">Need to create an account instead?</RouterLink>
                                }
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default AuthorizationForm;