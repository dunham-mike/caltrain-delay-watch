import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrain, faLongArrowAltUp, faLongArrowAltDown, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import { store } from '../../store/store';

const operator = 'Caltrain';
const scheduleType = 'Weekday';

const WatchCommute = (props) => {
    // Setting Up Data From Store
    const context = useContext(store);
    const { dispatch, state } = context;

    // Load Timetables
    useEffect(() => {
        if(state.timetables.weekday === null) {
            dispatch({ type: 'INITIATE_SERVER_REQUEST' });
            axios.get('http://localhost:8082/api/timetables/caltrain/weekday',
                   { headers: { 'Authorization': `Bearer ${state.token}` } }
                )
                .then(fetchResponse => {
                    console.log('fetchResponse:', fetchResponse);
                    dispatch({ type: 'LOAD_WEEKDAY_TIMETABLES', timetables: fetchResponse.data.timetables });
                })
                .catch(fetchError => {
                    console.log('[Error] Loading Caltrain weekday timetables failed:', fetchError);
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
            axios.delete('http://localhost:8082/api/watched-trains',
                { // Different format due to delete's parameters: https://github.com/axios/axios/issues/897#issuecomment-343715381
                    data: {
                        commuteType: commuteType
                    },
                    headers: { 'Authorization': `Bearer ${state.token}` },
                    withCredentials: true
                }
            )
            .then(fetchResponse => {
                console.log('fetchResponse:', fetchResponse);
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
            axios.post('http://localhost:8082/api/watched-trains',
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
                console.log('fetchResponse:', fetchResponse);
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

    const getActiveTrainsFromState = (activeStation, activeDirection, activeTimeframe) => {
        let activeTrains = [];

        let shortActiveDirection = null;
        if(activeDirection === "NB") {
            shortActiveDirection = "NB";
        } else if(activeDirection === "SB") {
            shortActiveDirection = "SB";
        } else {
            return activeTrains;
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

                activeTrains.push(trainObject);
            }
        }

        // TODO: shift activeTrains based on AM / PM prop, as well as trains before 3 am going to the end of the list

        return activeTrains;
    }

    let trainSchedule = null;

    if(station !== null && direction !== null) {
        let activeTrains = getActiveTrainsFromState(station, direction, 'weekday');
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

            let showLaterTimesButton = null;

            if(activeTrains.length > maxTrainsToShow) {
                showLaterTimesButton = (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <button className="button is-warning is-outlined" style={{ width: '200px', margin: '0.1875rem' }} onClick={showMoreTrainsHandler}>Show Later Times</button>
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
                    {showLaterTimesButton}
                </React.Fragment>
            );
        }
    }

    return (
        <div className="has-text-white" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '1.5rem 1.5rem' }}>
            <div>
                <div className="is-size-5 has-text-weight-semibold">Watch Commute</div>
                <div className="columns" style={{ marginTop: '0' }}>
                    <div className="column is-3" style={{ display: 'flex', alignItems: 'center' }}>
                        <div>Current {commuteType} Train: </div>
                    </div>
                    <div className="column" style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className={"button is-info is-light has-text-weight-bold"}>{selectedTrainText}</button>                        
                    </div>
                </div>
            </div>
            <div>
                <hr style={{ width: '30%', margin: '1.5rem auto', height: '1px', backgroundColor: 'rgba(112, 112, 112, 1)' }} />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
                <div className="is-size-5 has-text-weight-semibold">Update {commuteType} Commute</div>
                <div className="columns" style={{ marginTop: '1.5rem' }}>
                    <div className="column" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="field">
                            <p className="control has-icons-left">
                                <span className="select">
                                    <select onChange={changeStationHandler} value={(station ? station : '')}>
                                        <option>Select Your Station</option>

                                        <optgroup label="Zone 1">
                                            <option value="San Francisco">San Francisco</option>
                                            <option value="22nd Street">22nd Street</option>
                                            <option value="Bayshore">Bayshore</option>
                                            <option value="South San Francisco">South San Francisco</option>
                                            <option value="San Bruno">San Bruno</option>
                                        </optgroup>

                                        <optgroup label="Zone 2">
                                            <option value="Millbrae">Millbrae</option>
                                            {/* Skipping Broadway (Weekend Only) */}
                                            <option value="Burlingame">Burlingame</option>
                                            <option value="San Mateo">San Mateo</option>
                                            <option value="Hayward Park">Hayward Park</option>
                                            <option value="Hillsdale">Hillsdale</option>
                                            <option value="Belmont">Belmont</option>
                                            <option value="San Carlos">San Carlos</option>
                                            <option value="Redwood City">Redwood City</option>
                                        </optgroup>

                                        <optgroup label="Zone 3">
                                            {/* Skipping Atherton (Weekend Only) */}
                                            <option value="Menlo Park">Menlo Park</option>
                                            <option value="Palo Alto">Palo Alto</option>
                                            {/* Skipping Stanford (Football Only) */}
                                            <option value="California Ave.">California Ave.</option>
                                            <option value="San Antonio">San Antonio</option>
                                            <option value="Mountain View">Mountain View</option>
                                            <option value="Sunnyvale">Sunnyvale</option>
                                        </optgroup>

                                        <optgroup label="Zone 4">
                                            <option value="Lawrence">Lawrence</option>
                                            <option value="Santa Clara">Santa Clara</option>
                                            <option value="College Park">College Park</option>
                                            <option value="San Jose Diridon">San Jose Diridon</option>
                                            <option value="Tamien">Tamien</option>
                                        </optgroup>

                                        <optgroup label="Zone 5">
                                            <option value="Capitol">Capitol</option>
                                            <option value="Blossom Hill">Blossom Hill</option>
                                        </optgroup>

                                        <optgroup label="Zone 6">
                                            <option value="Morgan Hill">Morgan Hill</option>
                                            <option value="San Martin">San Martin</option>
                                            <option value="Gilroy">Gilroy</option>
                                        </optgroup>

                                    </select>
                                </span>
                                <span className="icon is-left" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faTrain} style={{ fontSize: '20px'}} />                                
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="column" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="field has-addons">
                            <p className="control">
                                <button 
                                    onClick={()=> changeDirectionHandler('NB')}
                                    className={"button is-success" + (direction !== "NB" ? ' is-outlined' : '')}
                                >
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faLongArrowAltUp} style={{ fontSize: '20px'}} />                                
                                    </span>
                                    <span>Northbound</span>
                                </button>
                            </p>
                            <p className="control">
                                <button 
                                    onClick={()=> changeDirectionHandler('SB')}
                                    className={"button is-warning" + (direction !== "SB" ? ' is-outlined' : '')}
                                >
                                    <span>Southbound</span>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faLongArrowAltDown} style={{ fontSize: '20px'}} />                                
                                    </span>
                                </button>
                            </p>

                        </div>
                        
                    </div>
                </div>
                {trainSchedule}
                {deleteTrainButton}
            </div>
        </div>
    );
}

export default WatchCommute;