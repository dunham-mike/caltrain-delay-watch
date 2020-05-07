import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const loginUser = async (email, password, dispatch) => {

    try {
        const response = await axios.post(backendUrl + '/api/auth/login',
            {
                "user": {
                    "email": email,
                    "password": password
                }
            })

        if(response.data.email && response.data.token) {
            const user = response.data.email;
            const token = response.data.token;
            dispatch({ type: 'LOG_IN_USER', user: user, token: token });
            return null;
        } else {
            return response.data;
        }
    } catch(err) {
        console.log(err);
        return err;
    }
}

export const createAccount = async (email, password, preferredNotificationMethod, phoneNumber, dispatch) => {
    const accountCreationBody = {
        "user": {
            "email": email,
            "password": password,
            "preferredNotificationMethod": preferredNotificationMethod
        }
    };

    if(preferredNotificationMethod === "sms") {
        accountCreationBody.user.phoneNumber = phoneNumber;
    }

    try {
        const response = await axios.post(backendUrl + '/api/auth/create-account', accountCreationBody);

        if(response.data === 'Account successfully created.') {
            // Small delay necessary for login request to resolve successfully
            await new Promise(resolve => setTimeout(resolve, 200));
            await loginUser(email, password, dispatch);
            return null;
        } else {
            console.log(response.data);
            return response.data;
        }
    } catch(err) {
        console.log(err);
        return err;
    }
}