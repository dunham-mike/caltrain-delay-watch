import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { store } from '../../store/store';

export const CreateAccount = () => {
    const [error, setError] = useState(null);

    const context = useContext(store);
    const { dispatch, state } = context;

    let errorMessage = null;
    if(error) {
        errorMessage = (<div className="field has-text-primary" id="signupErrorMessage" style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                            {error}
                        </div>);
    }

    let authRedirect = null;
    if(state.user) {
        authRedirect = <Redirect to={'/'} />
    }

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:8082/api/auth/login',
                {
                    "user": {
                        "email": email,
                        "password": password
                    }
                })

            if(response === 'Email or password is invalid.') {
                dispatch({ type: 'SET_ERROR', error: response });
            } else {
                dispatch({ type: 'LOG_IN_USER', user: response.data.email, token: response.data.token });
            }
        } catch(err) {
            console.log(err);
            dispatch({ type: 'SET_ERROR', error: 'Unable to log in' });
        }
    }

    const submitHandler = async (values, { setSubmitting }) => {
        console.log('submitHandler() fired!');
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

            if(response.data === 'Account successfully created') {
                // Small delay necessary for login request to resolve successfully
                await new Promise(resolve => setTimeout(resolve, 100));
                await loginUser(values.email, values.password);
            } else {
                setError(response.data);
                setSubmitting(false);
            }
        } catch(err) {
            setError(err);
            setSubmitting(false);
        }
    }
    
    return(
        <div className="has-text-white" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '0.75rem 1.5rem' }}>
            {authRedirect}
            <div className="is-size-5 has-text-weight-bold" style={{ display: 'flex', justifyContent: 'center' }}>
                <div>Create Account</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string()
                            .email('Invalid email address')
                            .required('Required'),
                        password: Yup.string()
                            .min(6, 'Must be 6 characters or more')
                            .max(20, 'Must be 20 characters or less')
                            .required('Required'),
                    })}
                    onSubmit={(values, { setSubmitting }) => { submitHandler(values, { setSubmitting })}}
                >
                    {({ isSubmitting, isValid, dirty, touched }) => (
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
                            <div className="field" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                                <button 
                                    className={"button is-outlined " + 
                                        ((!isValid || !dirty || isSubmitting || !touched['email']) 
                                        ? "is-light" 
                                        : "is-success")
                                    }
                                    disabled={
                                        !isValid 
                                        || !dirty 
                                        || isSubmitting 
                                        || !touched['email']
                                        // || !touched['password'] // Don't check this, so that submit button will activate once minimum password length reached
                                    }
                                    type="submit"
                                >
                                    Create Account
                                </button>
                            </div>
                            {errorMessage}
                            <div className="field" style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                                <RouterLink to="/login" className="has-text-info">Need to log in instead?</RouterLink>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default CreateAccount;