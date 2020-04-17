import React, { createContext, useReducer } from 'react';

import moment from 'moment-timezone';
// import tz from 'moment-timezone';

// Pattern from: https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/

const initialState = {
        amTrainWatched: null,
        pmTrainWatched: null,
        // lastAlertUpdateTime: moment().subtract(1, 'day'), // TODO: replace with real data
        lastAlertUpdateTime: moment().subtract(7, 'minute'), // TODO: replace with real data
        currentAlert: null,
        // currentAlert: {
        //     calendarDate: moment().subtract(1, 'hour'),
        //     train: {
        //         station: 'Burlingame',
        //         direction: 'Northbound',
        //         time: '6:06 am',
        //         trainNumber: '103'
        //     },
        //     expectedArrivalTime: '6:38 am'
        // },
        historicalAlerts: []
    };

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ( { children } ) => {
    const [state, dispatch] = useReducer((state, action) => {
        let newState;

        switch(action.type) {
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
            default:
                throw new Error();
        };
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };