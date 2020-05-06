import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
import PhoneInput from "react-phone-number-input/input";
import styled from 'styled-components';

const RadioLabel = styled.label`
    &:hover { color: white; };
`

const AuthorizationForm = (props) => {

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

    if(props.formVersion === 'CreateAccount') {
        initialValues.preferredNotificationMethod = 'sms';
        initialValues.phoneNumber = '';

        validationSchema.preferredNotificationMethod = Yup.string().required('Required');

        validationSchema.phoneNumber = Yup.string()
            .when('preferredNotificationMethod', {
                is: 'sms',
                then: Yup.string()
                    .min(12, 'Must be a valid US phone number')
                    .max(12, 'Must be a valid US phone number')
                    .required('Required')
            });
    }

    return(
        <React.Fragment>
            <div className="is-size-5 has-text-weight-bold has-text-white" style={{ display: 'flex', justifyContent: 'center' }}>
                <div>{props.formVersion === 'CreateAccount' ? 'Create Account' : 'Log In'}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object().shape(validationSchema)}
                    onSubmit={
                        props.formVersion === 'CreateAccount'
                        ? (values, { setSubmitting }) => { props.createAccountSubmitHandler(values, { setSubmitting })}
                        : (values, { setSubmitting }) => { props.loginSubmitHandler(values, { setSubmitting })}
                    }
                >
                    {({ isSubmitting, isValid, dirty, touched, handleChange, handleBlur, values, setFieldValue }) => (
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
                            
                            {(  props.formVersion === 'CreateAccount'
                                ?
                                    <React.Fragment>
                                        <label className="label has-text-white">
                                            Preferred Notification Method:
                                        </label>
                                        <Field name="preferredNotificationMethod" className="control">
                                            {({ field }) => (
                                                <>
                                                    <div className="control has-text-white"
                                                        style={{ paddingLeft: '1.125rem', paddingRight: '1.125rem', display: 'flex', justifyContent: 'space-between' }}
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
                                                    <Field type="input" name="phoneNumber" id="phoneNumber">
                                                        {({ field }) => (                                
                                                            <PhoneInput
                                                                className="input"
                                                                country="US"
                                                                value={field.value}
                                                                onChange={(value) => setFieldValue("phoneNumber", value)}
                                                                onBlur={handleBlur(field.name)}
                                                                maxLength="16"
                                                            />
                                                        )}
                                                    </Field>
                                                    <ErrorMessage name="phoneNumber" component="div" className="has-text-primary" style={{ marginTop: '0.375rem', paddingLeft: '0.375rem' }} />
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
                                        ) 
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
                                    {props.formVersion === 'CreateAccount' ? 'Create Account' : 'Log In'}
                                </button>
                            </div>
                            <div className="field" style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                                {props.formVersion === 'CreateAccount' 
                                    ? <RouterLink to="/login" className="has-text-info">Need to log in instead?</RouterLink> 
                                    : <RouterLink to="/create-account" className="has-text-info">Need to create an account instead?</RouterLink>
                                }
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </React.Fragment>
    );
}

export default AuthorizationForm;