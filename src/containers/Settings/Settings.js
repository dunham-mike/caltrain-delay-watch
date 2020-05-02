import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { store } from '../../store/store';
import PhoneInput from "react-phone-number-input/input";
import styled from 'styled-components';

import ErrorModal from '../../components/AuthorizationErrorModal/AuthorizationErrorModal';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const RadioLabel = styled.label`
    &:hover { color: white; };
`

export const Settings = (props) => {
    const context = useContext(store);
    const { dispatch, state } = context;

    const [error, setError] = useState(null);

    const initialValues={
        phoneNumber: (state.phoneNumber ? state.phoneNumber : ''),
        preferredNotificationMethod: (state.preferredNotificationMethod ? state.preferredNotificationMethod : 'sms')
    }

    const validationSchema = {
        preferredNotificationMethod: Yup.string().required('Required'),
        phoneNumber: Yup.string()
            .when('preferredNotificationMethod', {
                is: 'sms',
                then: Yup.string()
                    .min(12, 'Must be a valid US phone number')
                    .max(12, 'Must be a valid US phone number')
                    .required('Required')
            })
    };

    const updateUserDataSubmitHandler = async (values, { setSubmitting }) => {
        console.log('updateUserDataSubmitHandler() firing!');
        console.log('values:', values);

        if(values.preferredNotificationMethod !== state.preferredNotificationMethod 
            || (values.preferredNotificationMethod === "web app" && state.phoneNumber !== null)  
            || (values.preferredNotificationMethod === "sms" && values.phoneNumber !== state.phoneNumber)
            ) {
            const userUpdateBody = {
                preferredNotificationMethod: values.preferredNotificationMethod,
                phoneNumber: (values.preferredNotificationMethod === "sms" ? values.phoneNumber : null)
            };
            
            try {
                dispatch({ type: 'INITIATE_SERVER_REQUEST'});
                const response = await axios.post(backendUrl + '/api/user-data/preferences', userUpdateBody,
                        { headers: { 'Authorization': `Bearer ${state.token}` } }
                    );
                dispatch({ type: 'SERVER_REQUEST_COMPLETE'});

                console.log('response:', response);
    
                if(response.data === 'User preferences successfully updated.') {
                    dispatch({ 
                        type: 'UPDATE_USER_PREFERENCES', 
                        preferredNotificationMethod: values.preferredNotificationMethod,
                        phoneNumber: (values.preferredNotificationMethod === "sms" ? values.phoneNumber : null)
                    });
                    console.log('User update successful - redirecting');
                    props.history.push("/");
                } else {
                    setError(response.data);
                    setSubmitting(false);
                }
            } catch(err) {
                setError('Error communicating with the server. Please refresh the page.');
                setSubmitting(false);
            }
        } else {
            console.log('No data changed - redirecting');
            props.history.push("/");
        }
    }

    const closeErrorModal = () => {
        setError(null);
    }

    return(
        <div className="has-text-white" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '1.5rem 1.5rem' }}>
            <ErrorModal isAuthorizationErrorModalActive={error !== null} errorMessage={error} closeAuthorizationErrorModal={closeErrorModal} />
            <div className="is-size-5 has-text-weight-bold" style={{ display: 'flex', justifyContent: 'center' }}>
                <div>Settings</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object().shape(validationSchema)}
                    onSubmit={
                        (values, { setSubmitting }) => { updateUserDataSubmitHandler(values, { setSubmitting })}
                    }
                >
                    {({ isSubmitting, isValid, dirty, handleChange, handleBlur, values, setFieldValue }) => (
                        <Form>
                            <label className="label has-text-white" style={{ marginTop: '0.75rem', minWidth: '300px' }}>
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
                                ?   <div className="field" style={{ marginTop: '1.125rem', minWidth: '300px' }}>
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
                                  
                            <div className="field" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                <button 
                                    className={"button is-outlined " + 
                                        ((
                                            !isValid // Not checking !dirty, because will just redirect if data is the same as before
                                            || isSubmitting
                                        ) 
                                        ? "is-light" 
                                        : "is-success")
                                    }
                                    disabled={
                                        !isValid 
                                        || isSubmitting
                                    }
                                    type="submit"
                                >
                                    Update Settings
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Settings;