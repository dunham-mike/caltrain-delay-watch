import React, { useContext, useState } from 'react';

import { store } from '../../store/store';
import { updateUserPreferences } from '../../services/backendService';

import ErrorModal from '../../components/ErrorModal/ErrorModal';
import SettingsForm from './SettingsForm/SettingsForm';
import PageContainer from '../PageContainer/PageContainer';

export const Settings = (props) => {
    const context = useContext(store);
    const { dispatch, state } = context;

    const [error, setError] = useState(null);

    const isUserDataDifferentThanState = (preferredNotificationMethod, phoneNumber) => {
        return(preferredNotificationMethod !== state.preferredNotificationMethod 
                || (preferredNotificationMethod === "web app" && state.phoneNumber !== null)  
                || (preferredNotificationMethod === "sms" && phoneNumber !== state.phoneNumber)
            );
    }

    const updateUserDataSubmitHandler = async (values, { setSubmitting }) => {
        if(isUserDataDifferentThanState(values.preferredNotificationMethod, values.phoneNumber)) {
            const updateUserPreferencesError = await updateUserPreferences(values.preferredNotificationMethod, values.phoneNumber, dispatch, state.token);
            if(updateUserPreferencesError !== null) {
                setError(updateUserPreferencesError);
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
        <PageContainer>
            <ErrorModal isErrorModalActive={error !== null} errorMessage={error} closeErrorModal={closeErrorModal} />
            <SettingsForm 
                phoneNumber={state.phoneNumber}
                preferredNotificationMethod={state.preferredNotificationMethod}
                updateUserDataSubmitHandler={updateUserDataSubmitHandler}
            />
        </PageContainer>
    );
};

export default Settings;