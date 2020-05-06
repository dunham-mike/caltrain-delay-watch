import React, { useContext, useState } from 'react';
import axios from 'axios';
import { store } from '../../store/store';

import ErrorModal from '../../components/ErrorModal/ErrorModal';
import SettingsForm from './SettingsForm/SettingsForm';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const Settings = (props) => {
    const context = useContext(store);
    const { dispatch, state } = context;

    const [error, setError] = useState(null);

    const updateUserData = async (preferredNotificationMethod, phoneNumber) => {
        const userUpdateBody = {
            preferredNotificationMethod: preferredNotificationMethod,
            phoneNumber: (preferredNotificationMethod === "sms" ? phoneNumber : null)
        };
        
        try {
            dispatch({ type: 'INITIATE_SERVER_REQUEST'});
            const response = await axios.post(backendUrl + '/api/user-data/preferences', userUpdateBody,
                    { headers: { 'Authorization': `Bearer ${state.token}` } }
                );
            dispatch({ type: 'SERVER_REQUEST_COMPLETE'});

            if(response.data === 'User preferences successfully updated.') {
                dispatch({ 
                    type: 'UPDATE_USER_PREFERENCES', 
                    preferredNotificationMethod: preferredNotificationMethod,
                    phoneNumber: (preferredNotificationMethod === "sms" ? phoneNumber : null)
                });
                return null;
            } else {
                return response.data;
            }
        } catch(err) {
            return 'Error communicating with the server. Please refresh the page.';
        }
    }

    const isUserDataDifferentThanState = (preferredNotificationMethod, phoneNumber) => {
        return(preferredNotificationMethod !== state.preferredNotificationMethod 
                || (preferredNotificationMethod === "web app" && state.phoneNumber !== null)  
                || (preferredNotificationMethod === "sms" && phoneNumber !== state.phoneNumber)
            );
    }

    const updateUserDataSubmitHandler = async (values, { setSubmitting }) => {
        if(isUserDataDifferentThanState(values.preferredNotificationMethod, values.phoneNumber)) {
            const updateUserDataError = await updateUserData(values.preferredNotificationMethod, values.phoneNumber);
            if(updateUserDataError !== null) {
                setError(updateUserDataError);
            }
            setSubmitting(false);
            props.history.push("/");
        } else {
            props.history.push("/");
        }
    }

    const closeErrorModal = () => {
        setError(null);
    }

    return(
        <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '1.5rem 1.5rem' }}>
            <ErrorModal isErrorModalActive={error !== null} errorMessage={error} closeErrorModal={closeErrorModal} />
            <SettingsForm 
                phoneNumber={state.phoneNumber}
                preferredNotificationMethod={state.preferredNotificationMethod}
                updateUserDataSubmitHandler={updateUserDataSubmitHandler}
            />
        </div>
    );
};

export default Settings;