import React, { createContext, useReducer } from 'react';

import moment from 'moment-timezone';
// import tz from 'moment-timezone';

// Pattern from: https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/

const initialState = {
        user: null,
        token: null,
        loading: false,
        error: null,
        preferredNotificationMethod: null,
        phoneNumber: null,
        initialDataLoaded: false,
        amTrainWatched: null,
        pmTrainWatched: null,
        amTrainStatus: null,
        pmTrainStatus: null,
        lastTrainStatusUpdate: null,
        // lastAlertUpdateTime: moment().subtract(1, 'day'), // TODO: replace with real data
        lastAlertUpdateTime: moment().subtract(7, 'minute'), // TODO: replace with real data
        mostRecentNotifications: [],
        currentStatus: null,
        historicalAlerts: [],
        timetables: {
            weekday: null,
            weekend: null
        },
    };

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ( { children } ) => {
    const [state, dispatch] = useReducer((state, action) => {
        let newState;

        switch(action.type) {
            case 'LOG_IN_USER':
                console.log('token:', action.token);
                newState = {
                    ...state,
                    user: action.user,
                    token: action.token
                }
                return newState;
            case 'LOG_OUT_USER':
                newState = initialState;
                return newState;
            case 'SET_ERROR':
                newState = {
                    ...state,
                    error: action.error
                }
                return newState;
            case 'SET_USER_DATA':
                newState = {
                    ...state,
                    mostRecentNotifications: action.mostRecentNotifications,
                    amTrainWatched: action.amTrainWatched,
                    pmTrainWatched: action.pmTrainWatched,
                    preferredNotificationMethod: action.preferredNotificationMethod,
                    phoneNumber: action.phoneNumber
                }
                return newState;
            case 'SET_CURRENT_STATUS':
                newState = {
                    ...state,
                    currentStatus: action.currentStatus,
                }
                return newState;
            case 'INITIAL_DATA_LOADED': 
                newState = {
                    ...state,
                    initialDataLoaded: true,
                }
                return newState;
            case 'INITIATE_SERVER_REQUEST':
                newState = {
                    ...state,
                    loading: true,
                }
                return newState;
            case 'SERVER_REQUEST_COMPLETE':
                newState = {
                    ...state,
                    loading: false,
                }
                return newState;
            case 'UPDATE_USER_PREFERENCES':
                newState = {
                    ...state,
                    preferredNotificationMethod: action.preferredNotificationMethod,
                    phoneNumber: action.phoneNumber
                }
                return newState;
            case 'UPDATE_TRAIN_WATCHED':
                if(action.trainType === 'AM') {
                    newState = {
                        ...state,
                        amTrainWatched: action.train,
                        amTrainStatus: null,
                        loading: false,
                    }
                } else if(action.trainType === 'PM') {
                    newState = {
                        ...state,
                        pmTrainWatched: action.train,
                        pmTrainStatus: null,
                        loading: false,
                    }
                } else {
                    throw new Error();
                }
                return newState;
            case 'UPDATE_TRAIN_STATUS':
                if(action.commuteType === 'AM') {
                    newState = {
                        ...state,
                        amTrainStatus: action.status,
                    }
                } else if(action.commuteType === 'PM') {
                    newState = {
                        ...state,
                        pmTrainStatus: action.status,
                    }
                } else {
                    throw new Error();
                }
                return newState;
            case 'LOAD_WEEKDAY_TIMETABLES':
                const newTimetables = { ...state.timetables };

                newTimetables.weekday = action.timetables;

                newState = {
                    ...state,
                    timetables: newTimetables,
                    loading: false,
                }
                return newState;
            default:
                throw new Error();
        };
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };