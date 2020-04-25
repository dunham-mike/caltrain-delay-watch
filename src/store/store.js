import React, { createContext, useReducer } from 'react';

import moment from 'moment-timezone';
// import tz from 'moment-timezone';

// Pattern from: https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/

const initialState = {
        user: null,
        token: null,
        loading: false,
        error: null,
        initialDataLoaded: false,
        amTrainWatched: null,
        pmTrainWatched: null,
        // lastAlertUpdateTime: moment().subtract(1, 'day'), // TODO: replace with real data
        lastAlertUpdateTime: moment().subtract(7, 'minute'), // TODO: replace with real data
        currentAlert: null,
        // currentAlert: {
        //     calendarDate: moment().subtract(1, 'hour'),
        //     train: {
        //         station: 'Burlingame',
        //         direction: 'NB',
        //         time: '6:06 am',
        //         trainNumber: '103'
        //     },
        //     expectedArrivalTime: '6:38 am'
        // },
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
            case 'INITIATE_LOADING_USER_DATA':
                newState = {
                    ...state,
                    loading: true,
                }
                return newState;
            case 'SET_ERROR':
                newState = {
                    ...state,
                    error: action.error
                }

                return newState;
            case 'LOAD_USER_DATA':
                newState = {
                    ...state,
                    loading: false,
                    initialDataLoaded: true,
                    amTrainWatched: action.amTrainWatched,
                    pmTrainWatched: action.pmTrainWatched,
                }

                return newState;
            case 'UPDATE_TRAIN_WATCHED':
                if(action.trainType === 'AM') {
                    newState = {
                        ...state,
                        amTrainWatched: action.train
                    }
                } else if(action.trainType === 'PM') {
                    newState = {
                        ...state,
                        pmTrainWatched: action.train
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
                    timetables: newTimetables
                }
                return newState;
            default:
                throw new Error();
        };
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };