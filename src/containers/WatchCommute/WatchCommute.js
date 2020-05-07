import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import { store } from '../../store/store';
import CurrentTrain from './CurrentTrain/CurrentTrain';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import UpdateCommute from './UpdateCommute/UpdateCommute';
import PageContainer from '../PageContainer/PageContainer';

const operator = 'Caltrain';
const scheduleType = 'Weekday';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const WatchCommute = (props) => {
    // Setting Up Data From Store
    const context = useContext(store);
    const { dispatch, state } = context;

    // Load Timetables
    useEffect(() => {
        if(state.timetables.weekday === null) {
            dispatch({ type: 'INITIATE_SERVER_REQUEST' });
            axios.get(backendUrl + '/api/timetables/caltrain/weekday',
                   { headers: { 'Authorization': `Bearer ${state.token}` } }
                )
                .then(fetchResponse => {
                    dispatch({ type: 'LOAD_WEEKDAY_TIMETABLES', timetables: fetchResponse.data.timetables });
                })
                .catch(fetchError => {
                    console.log('[Error] Loading Caltrain weekday timetables failed:', fetchError);
                    dispatch({ type: 'SET_ERROR', error: 'Loading Caltrain weekday timetables failed.' });
                });
        }
    }, [state.timetables.weekday, state.token, dispatch]);

    // Setting Up Data Passed Via RouterLink
    let commuteType = 'AM';
    if(props.location.state) {
        commuteType = props.location.state.commuteType;
    }

    let selectedTrain = state.amTrainWatched;
    if(commuteType === 'PM') {
        selectedTrain = state.pmTrainWatched;
    }

    let history = useHistory();
    const selectTrainHandler = async (train) => { // TODO: remove async
        dispatch({ type: 'INITIATE_SERVER_REQUEST' });
 
        if(train === null) {            
            axios.delete(backendUrl + '/api/user-data',
                { // Different format due to delete's parameters: https://github.com/axios/axios/issues/897#issuecomment-343715381
                    data: {
                        commuteType: commuteType
                    },
                    headers: { 'Authorization': `Bearer ${state.token}` },
                    withCredentials: true
                }
            )
            .then(fetchResponse => {
                // 'Watched Train successfully cleared.';
                // TODO: Confirm that got correct response status code from server.

                dispatch({ type: 'UPDATE_TRAIN_WATCHED', trainType: commuteType, train: train });
                history.push('/');
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
                { headers: { 'Authorization': `Bearer ${state.token}` } }

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
                history.push('/');
            })
            .catch(fetchError => {
                console.log('[Error] Updating Watched Train for user failed:', fetchError);
                dispatch({ type: 'SET_ERROR', error: 'Updating Watched Train for user failed.' });
            });
        }

        dispatch({ type: 'UPDATE_TRAIN_WATCHED', trainType: commuteType, train: train });
        history.push('/');
    }

    const getActiveTrainsFromState = (activeStation, activeDirection, activeTimeframe, commuteType) => {
        const amTrains = [];
        const pmTrains = [];

        let shortActiveDirection = null;
        if(activeDirection === "NB") {
            shortActiveDirection = "NB";
        } else if(activeDirection === "SB") {
            shortActiveDirection = "SB";
        } else {
            return [];
        }

        const timetablesData = state.timetables[activeTimeframe];

        if(timetablesData !== null) {
            /*
                timetablesData format:
                {
                    70011: {
                        direction: 'NB',
                        stationName: 'San Francisco',
                        timetable: [ { arrivalTime: '06:03:00', trainNumber: '101' }, ... ]
                    }
                }
            */

            const stopIdKeys = Object.keys(timetablesData);

            let stopId = null;
            for(let i=0; i<stopIdKeys.length; i++) {
                const stopData = timetablesData[stopIdKeys[i]];

                if(stopData.stationName === activeStation && stopData.direction === shortActiveDirection) {
                    stopId = stopIdKeys[i];
                    break;
                }
            }

            const stationTimetable = timetablesData[stopId].timetable;
            for(let j=0; j<stationTimetable.length; j++) {
                const trainObject = {
                    station: activeStation,
                    stopId: stopId,
                    direction: (shortActiveDirection === 'NB' ? 'NB' : 'SB'),
                    time: moment('1970-01-01 ' + stationTimetable[j].arrivalTime).format('h:mm a'),
                    trainNumber: stationTimetable[j].trainNumber,
                };

                if(moment('1970-01-01 ' + trainObject.time).isBefore(moment('1970-01-01 12:00 pm'))) {
                    amTrains.push(trainObject);
                } else {
                    pmTrains.push(trainObject);
                }
            }
        }

        if(commuteType === "AM") {
            return amTrains.concat(pmTrains);
        } else {
            return pmTrains.concat(amTrains);
        }
    }

    return (
        <PageContainer>
            <CurrentTrain 
                commuteType={commuteType}
                selectedTrain={selectedTrain}
            />
            <HorizontalRule />
            <UpdateCommute 
                commuteType={commuteType}
                loading={state.loading}
                selectedTrain={selectedTrain}
                selectTrainHandler={selectTrainHandler}
                getActiveTrainsFromState={getActiveTrainsFromState}
            />
        </PageContainer>
    );
}

export default WatchCommute;