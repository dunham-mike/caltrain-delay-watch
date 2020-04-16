import React, { createContext, useReducer } from 'react';

// Pattern from: https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/

const initialState = {
        amTrainWatched: null,
        pmTrainWatched: null,
        currentAlerts: [],
        historicalAlerts: []
    };

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ( { children } ) => {
    const [state, dispatch] = useReducer((state, action) => {
        let newState;

        switch(action.type) {
            case 'UPDATE_TRAIN_WATCHED':
                console.log('updating train watched');
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