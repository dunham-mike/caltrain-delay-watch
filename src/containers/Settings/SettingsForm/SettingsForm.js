import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PhoneInput from "react-phone-number-input/input";
import styled from 'styled-components';


const RadioLabel = styled.label`
    &:hover { color: white; };
`

const SettingsForm = (props) => {

    const initialValues={
        phoneNumber: (props.phoneNumber ? props.phoneNumber : ''),
        preferredNotificationMethod: (props.preferredNotificationMethod ? props.preferredNotificationMethod : 'sms')
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

    return(
        <React.Fragment>
            <div className="is-size-5 has-text-weight-bold has-text-white" style={{ display: 'flex', justifyContent: 'center' }}>
                <div>Settings</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object().shape(validationSchema)}
                    onSubmit={
                        (values, { setSubmitting }) => { props.updateUserDataSubmitHandler(values, { setSubmitting })}
                    }
                >
                    {({ isSubmitting, isValid, handleBlur, values, setFieldValue }) => (
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
                                            !isValid // Not checking !dirty, because app will just redirect without updating server if data is the same as before
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
        </React.Fragment>
    );
}

export default SettingsForm;