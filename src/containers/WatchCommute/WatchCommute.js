import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

import { store } from '../../store/store';
import CurrentTrain from './CurrentTrain/CurrentTrain';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import UpdateCommute from './UpdateCommute/UpdateCommute';

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

    // Managing Local State
    const [station, setStation] = useState(null);
    const [direction, setDirection] = useState(null);
    const [maxTrainsToShow, setMaxTrainsToShow] = useState(10);

    const changeStationHandler = (event) => {
        if (event.target.value === "Select Your Station") {
            setStation(null);
        } else {
            setStation(event.target.value);
        }
    }

    const changeDirectionHandler = (newDirection) => {
        if (direction !== newDirection) {
            setDirection(newDirection);
        }
    }

    const showMoreTrainsHandler = () => {
        setMaxTrainsToShow(prevState => prevState + 10);
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

    // Conditional Page Elements
    let selectedTrainText = '(none)';
    let deleteTrainButton = null;

    if(selectedTrain !== null) {
        selectedTrainText = selectedTrain.station 
            + ' Station: ' 
            + (selectedTrain.direction === "NB" ? "NB" : "SB") + ' ' 
            + selectedTrain.trainNumber + ' at ' + selectedTrain.time;
        
        deleteTrainButton = (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4.5rem' }}>
                <button className={"button is-primary is-outlined" + (state.loading ? " is-loading" : "")} onClick={() => selectTrainHandler(null)}>
                    <span className="icon">
                        <FontAwesomeIcon icon={faWindowClose} />                                
                    </span>
                    <span>Or Delete Current Train</span>
                </button>
            </div>
        );
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

    let trainSchedule = null;

    if(station !== null && direction !== null) {
        let activeTrains = getActiveTrainsFromState(station, direction, 'weekday', commuteType);
        // let activeTrains = trains.filter((train => train.station === station && train.direction === direction))

        if(activeTrains.length === 0) {
            trainSchedule = (
                <React.Fragment>
                    <div className="has-text-weight-semibold has-text-centered" style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                        Cannot find any trains for that station and direction of travel. Please try another.
                    </div>
                </React.Fragment>
            )
        } else {
            const maxTrainsToShowPerColumn = Math.ceil(Math.min(maxTrainsToShow, activeTrains.length) / 2);

            const trainElements = activeTrains.map(train => {
                return (
                    <button 
                        className={"button is-info" 
                            + (selectedTrain !== null && train.trainNumber === selectedTrain.trainNumber && train.time === selectedTrain.time ? '' : " is-outlined")
                        } 
                        style={{ width: '200px', margin: '0.1875rem' }} 
                        key={train.trainNumber}
                        onClick={() => selectTrainHandler(train)}
                    >
                        {train.time} - {train.direction === "NB" ? 'NB' : 'SB'} {train.trainNumber}
                    </button>
                );
            })

            const firstHalfTrainElements = trainElements.slice(0, maxTrainsToShowPerColumn);
            const secondHalfTrainElements = trainElements.slice(maxTrainsToShowPerColumn, maxTrainsToShow);

            let showMoreTimesButton = null;

            if(activeTrains.length > maxTrainsToShow) {
                showMoreTimesButton = (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <button className="button is-warning is-outlined" style={{ width: '200px', margin: '0.1875rem' }} onClick={showMoreTrainsHandler}>Show More Times</button>
                    </div>
                );
            }

            trainSchedule = (
                <React.Fragment>
                    <div className="has-text-weight-semibold" style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Choose Train to Watch:</div>
                    <div className="columns" style={{ marginTop: '0.75rem', marginBottom: '0' }}>
                        <div className="column is-6" style={{ margin: '0', padding: '0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {firstHalfTrainElements}
                            </div>
                        </div>
                        <div className="column is-6" style={{ margin: '0', padding: '0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {secondHalfTrainElements}
                            </div>
                        </div>
                    </div>
                    {showMoreTimesButton}
                </React.Fragment>
            );
        }
    }

    return (
        <div className="has-text-white" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '1.5rem 1.5rem' }}>
            <CurrentTrain 
                commuteType={commuteType}
                selectedTrainText={selectedTrainText}
            />
            <HorizontalRule />
            <UpdateCommute 
                commuteType={commuteType}
                changeStationHandler={changeStationHandler}
                station={station}
                changeDirectionHandler={changeDirectionHandler}
                direction={direction}
                trainSchedule={trainSchedule}
                deleteTrainButton={deleteTrainButton}
            />
        </div>
    );
}

export default WatchCommute;