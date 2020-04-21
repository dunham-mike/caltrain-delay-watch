import { useContext } from 'react';
import { store } from '../store/store';
import axios from 'axios';

const useLogin = async(email, password) => {
    const context = useContext(store);
    const { dispatch, state } = context;

    if(email && password && state.user === null && state.token === null && state.error === null) {
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
                return false;
            } else {
                dispatch({ type: 'LOG_IN_USER', user: response.data.email, token: response.data.token });
                return true;
            }
        } catch(err) {
            console.log(err);
            dispatch({ type: 'SET_ERROR', error: 'Unable to log in' });
            return false;
        }
    } 

    return false;
}

export default useLogin;