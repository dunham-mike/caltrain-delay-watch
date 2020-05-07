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
};

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
};

export const updateUserPreferences = async (preferredNotificationMethod, phoneNumber, dispatch, token) => {
    const userUpdateBody = {
        preferredNotificationMethod: preferredNotificationMethod,
        phoneNumber: (preferredNotificationMethod === "sms" ? phoneNumber : null)
    };
    
    try {
        dispatch({ type: 'INITIATE_SERVER_REQUEST'});
        const response = await axios.post(backendUrl + '/api/user-data/preferences', userUpdateBody,
                { headers: { 'Authorization': `Bearer ${token}` } }
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
};

export const updateWatchedTrain = async (train, commuteType, operator, scheduleType, dispatch, token) => {
    dispatch({ type: 'INITIATE_SERVER_REQUEST' });
 
    if(train === null) {            
        axios.delete(backendUrl + '/api/user-data',
            { // Different format due to delete's parameters: https://github.com/axios/axios/issues/897#issuecomment-343715381
                data: {
                    commuteType: commuteType
                },
                headers: { 'Authorization': `Bearer ${token}` },
                withCredentials: true
            }
        )
        .then(fetchResponse => {
            // 'Watched Train successfully cleared.';
            // TODO: Confirm that got correct response status code from server.

            dispatch({ type: 'UPDATE_TRAIN_WATCHED', trainType: commuteType, train: train });
        })
        .catch(fetchError => {
            console.log('[Error] Deleting Watched Train for user failed:', fetchError);
            dispatch({ type: 'SET_ERROR', error: 'Deleting Watched Train for user failed.' });
        });
    } else {
        axios.post(backendUrl + '/api/user-data',
            {
                commuteType: commuteType,
                trainInfo: {
                    operator: operator,
                    scheduleType: scheduleType,
                    station: train.station,
                    stopId: train.stopId,
                    direction: train.direction,
                    time: train.time,
                    trainNumber: train.trainNumber
                }

            },
            { headers: { 'Authorization': `Bearer ${token}` } }

            /* 
                station: activeStation,
                direction: (shortActiveDirection === 'NB' ? 'NB' : 'SB'),
                time: moment('1970-01-01 ' + stationTimetable[j].arrivalTime).format('h:mm a'),
                trainNumber: stationTimetable[j].trainNumber,
            */
        )
        .then(fetchResponse => {
            // TODO: Confirm that got correct response status code from server.

            dispatch({ type: 'UPDATE_TRAIN_WATCHED', trainType: commuteType, train: train });
        })
        .catch(fetchError => {
            console.log('[Error] Updating Watched Train for user failed:', fetchError);
            dispatch({ type: 'SET_ERROR', error: 'Updating Watched Train for user failed.' });
        });
    }
};

export const getTimetables = (dispatch, token) => {
    dispatch({ type: 'INITIATE_SERVER_REQUEST' });
    axios.get(backendUrl + '/api/timetables/caltrain/weekday',
            { headers: { 'Authorization': `Bearer ${token}` } }
        )
        .then(fetchResponse => {
            dispatch({ type: 'LOAD_WEEKDAY_TIMETABLES', timetables: fetchResponse.data.timetables });
        })
        .catch(fetchError => {
            console.log('[Error] Loading Caltrain weekday timetables failed:', fetchError);
            dispatch({ type: 'SET_ERROR', error: 'Loading Caltrain weekday timetables failed.' });
        });
};

const getUserData = async (dispatch, token) => {
    const fetchResponse = await axios.get(backendUrl + '/api/user-data',
            { headers: { 'Authorization': `Bearer ${token}` } }
        )
        .catch(fetchError => {
            console.log('[Error] Loading Watched Trains and Notifications for user failed:', fetchError);
            dispatch({ type: 'SET_ERROR', error: 'Loading Watched Trains and Notifications for user failed.' });
            return null;
        });

    return fetchResponse;
};

const getCurrentStatus = async (dispatch, token) => {
    const fetchResponse = await axios.get(backendUrl + '/api/current-status',
            { headers: { 'Authorization': `Bearer ${token}` } }
        )
        .catch(fetchError => {
            console.log('[Error] Loading Current Status failed:', fetchError);
            dispatch({ type: 'SET_ERROR', error: 'Loading Current Status failed.' });
            return null;
        });

    return fetchResponse;
};

export const getUserDataAndCurrentStatus = async (dispatch, token) => {
    dispatch({ type: 'INITIATE_SERVER_REQUEST' });

    const userFetchResponse = await getUserData(dispatch, token);
    const currentStatusFetchResponse = await getCurrentStatus(dispatch, token);

    if(userFetchResponse !== null && currentStatusFetchResponse !== null) {
        dispatch({ 
            type: 'SET_USER_DATA', 
            mostRecentNotifications: (userFetchResponse.data.mostRecentNotifications ? userFetchResponse.data.mostRecentNotifications : null),
            amTrainWatched: (userFetchResponse.data.amWatchedTrain ? userFetchResponse.data.amWatchedTrain.trainInfo : null), 
            pmTrainWatched: (userFetchResponse.data.pmWatchedTrain ? userFetchResponse.data.pmWatchedTrain.trainInfo : null),
            preferredNotificationMethod: userFetchResponse.data.preferredNotificationMethod,
            phoneNumber: (userFetchResponse.data.phoneNumber ? userFetchResponse.data.phoneNumber : null)
        });

        dispatch({
            type: 'SET_CURRENT_STATUS',
            currentStatus: currentStatusFetchResponse.data
        })

        dispatch({ type: 'SERVER_REQUEST_COMPLETE' });

        return [true, { amTrainWatched: userFetchResponse.data.amWatchedTrain, pmTrainWatched: userFetchResponse.data.pmWatchedTrain }];
    } else {
        dispatch({ type: 'SET_ERROR', error: 'Loading Watched Trains and Notifications for user failed.' });

        return [false, {}];
    }

};