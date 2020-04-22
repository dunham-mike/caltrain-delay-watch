import React, { useContext } from 'react';
import { store } from '../../../store/store';import { useEffect } from 'react';

const Logout = () => {
    const context = useContext(store);
    const { dispatch } = context;

    useEffect(() => {
        dispatch({ type: 'LOG_OUT_USER' });
    });

    return (<div>Logging out...</div>);
}

export default Logout;