import React, { useContext, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import moment from 'moment-timezone';

import { store } from '../../store/store';
import TrainWatched from './TrainWatched/TrainWatched';
import CurrentNotifications from './CurrentNotifications/CurrentNotifications';

const FieldHasAddons = styled.div`
    @media (max-width: 480px) {
        display: none;
    }
`

const FieldNoAddons = styled.div`
    @media (min-width: 481px) {
        display: none;
    }
`

const Dashboard = (props) => {
    const context = useContext(store);
    const { dispatch, state } = context;

    // Load Initial Data

    const fetchUserData = useCallback(async () => {
        const fetchResponse = await axios.get('http://localhost:8082/api/watched-trains',
                { headers: { 'Authorization': `Bearer ${state.token}` } }
            )
            .catch(fetchError => {
                console.log('[Error] Loading Watched Trains and Notifications for user failed:', fetchError);
                return null;
            });

        return fetchResponse;
    }, [state.token]);

    const fetchCurrentStatus = useCallback(async () => {
        const fetchResponse = await axios.get('http://localhost:8082/api/current-status',
                { headers: { 'Authorization': `Bearer ${state.token}` } }
            )
            .catch(fetchError => {
                console.log('[Error] Loading Current Status failed:', fetchError);
                return null;
            });

        return fetchResponse;
    }, [state.token]);

    const fetchAppData = useCallback(async () => {
        dispatch({ type: 'INITIATE_SERVER_REQUEST' });

        const userFetchResponse = await fetchUserData();
        const currentStatusFetchResponse = await fetchCurrentStatus();

        if(userFetchResponse !== null && currentStatusFetchResponse !== null) {
            dispatch({ 
                type: 'SET_USER_DATA', 
                mostRecentNotifications: (userFetchResponse.data.mostRecentNotifications ? userFetchResponse.data.mostRecentNotifications : null),
                amTrainWatched: (userFetchResponse.data.amWatchedTrain ? userFetchResponse.data.amWatchedTrain.trainInfo : null), 
                pmTrainWatched: (userFetchResponse.data.pmWatchedTrain ? userFetchResponse.data.pmWatchedTrain.trainInfo : null) 
            });

            dispatch({
                type: 'SET_CURRENT_STATUS',
                currentStatus: currentStatusFetchResponse.data
            })

            dispatch({ type: 'SERVER_REQUEST_COMPLETE' });

            return true;
        } else {
            dispatch({ type: 'SET_ERROR', error: 'Loading Watched Trains and Notifications for user failed.' });

            return false;
        }
    }, [dispatch, fetchUserData, fetchCurrentStatus]);

    useEffect(() => {
        if(state.loading === false && state.error === null & state.initialDataLoaded === false) {

            const fetchInitialData = async () => {

                const isInitialLoadSuccessful = await fetchAppData();
                if (isInitialLoadSuccessful) {
                    dispatch({ type: 'INITIAL_DATA_LOADED' });
                }
            }

            fetchInitialData();
        }
    }, [state.loading, state.error, state.initialDataLoaded, dispatch, fetchAppData]);

    // Refresh statuses

    const refreshStatuses = async () => {
        console.log('Refresh statuses here');

        if(state.currentStatus && moment.utc().isBefore(moment.utc(state.currentStatus.createdAt).add(5, 'minutes'))) {
            console.log('New status updates are available every 5 minutes on weekdays. Please try again after ' +
                moment.utc(state.currentStatus.createdAt).tz("America/Los_Angeles").add(5, 'minutes').format('h:mm a')
            );
        } else {
            const isRefreshSuccessful = await fetchAppData();
            if(isRefreshSuccessful) {
                console.log('Data successfully refreshed!');
            } else {
                console.log('Unable to refresh data. Please reload the page.');
            }
        }

    }

    // Update train statuses if needed

    if(state.currentStatus && moment.utc(state.currentStatus.createdAt).isAfter(moment.utc().subtract(30, 'minutes'))
        && (state.lastTrainStatusUpdate === null 
                || moment.utc(state.currentStatus.createdAt).isAfter(moment.utc(state.lastTrainStatusUpdate))
            )
    ) {
        const currentStatuses = state.currentStatus.currentStatuses;
        let amStatusFound = false;
        let pmStatusFound = false;

        for(let i=0; i<currentStatuses.length; i++) {
            const thisCurrentStatus = currentStatuses[i];

            if(state.amTrainWatched !== null 
                && !amStatusFound 
                && thisCurrentStatus.station === state.amTrainWatched.station
                && thisCurrentStatus.direction === state.amTrainWatched.direction
                && thisCurrentStatus.trainNumber === state.amTrainWatched.trainNumber
            ) {
                amStatusFound = true;

                if(state.amTrainStatus === null 
                    || thisCurrentStatus.expectedDepartureTime !== state.amTrainStatus.expectedDepartureTime 
                ) {
                    dispatch({ 
                        type: 'UPDATE_TRAIN_STATUS', 
                        commuteType: 'AM', 
                        status: thisCurrentStatus,
                        // updateTime: state.currentStatus.createdAt
                     })
                }

            } else if(state.pmTrainWatched !== null 
                && !pmStatusFound 
                && thisCurrentStatus.station === state.pmTrainWatched.station
                && thisCurrentStatus.direction === state.pmTrainWatched.direction
                && thisCurrentStatus.trainNumber === state.pmTrainWatched.trainNumber
            ) {
                pmStatusFound = true;

                if(state.pmTrainStatus === null 
                    || thisCurrentStatus.expectedDepartureTime !== state.pmTrainStatus.expectedDepartureTime 
                ) {

                    dispatch({ 
                        type: 'UPDATE_TRAIN_STATUS', 
                        commuteType: 'PM', 
                        status: thisCurrentStatus,
                        // updateTime: state.currentStatus.createdAt
                    })
                }
            }
        }

        if(!amStatusFound && state.amTrainStatus !== null) {
            dispatch({ 
                type: 'UPDATE_TRAIN_STATUS', 
                commuteType: 'AM', 
                status: null,
                // updateTime: state.currentStatus.createdAt
             })
        }

        if(!pmStatusFound && state.pmTrainStatus !== null) {
            dispatch({ 
                type: 'UPDATE_TRAIN_STATUS', 
                commuteType: 'PM', 
                status: null,
                // updateTime: state.currentStatus.createdAt
             })
        }
    }

    // AM Commute JSX

    let amData = (
        <RouterLink to={{ 
            pathname: '/watch-commute',
            state: {
                commuteType: 'AM'
            }
        }}>
            <button className="button is-warning is-outlined">Select a morning train to watch!</button>
        </RouterLink>
    );

    if(state.amTrainWatched) {
        amData = (
            <React.Fragment>
                <FieldHasAddons>  
                    <TrainWatched 
                        hasAddons={true}
                        commuteType="AM"
                        trainWatched={state.amTrainWatched}
                        trainStatus={state.amTrainStatus}
                    />
                </FieldHasAddons>
                <FieldNoAddons>
                    <TrainWatched 
                        hasAddons={false}
                        commuteType="AM"
                        trainWatched={state.amTrainWatched}
                        trainStatus={state.amTrainStatus}
                    />
                </FieldNoAddons>
            </React.Fragment>
        );
    }

    // PM Commute JSX

    let pmData = (
        <RouterLink to={{ 
            pathname: '/watch-commute',
            state: {
                commuteType: 'PM'
            }
        }}>
            <button className="button is-info is-outlined">Select an evening train to watch!</button>
        </RouterLink>
    );

    if(state.pmTrainWatched) {
        pmData = (
            <React.Fragment>
                <FieldHasAddons>  
                    <TrainWatched 
                        hasAddons={true}
                        commuteType="PM"
                        trainWatched={state.pmTrainWatched}
                        trainStatus={state.pmTrainStatus}
                    />
                </FieldHasAddons>
                <FieldNoAddons>
                    <TrainWatched 
                        hasAddons={false}
                        commuteType="PM"
                        trainWatched={state.pmTrainWatched}
                        trainStatus={state.pmTrainStatus}
                    />
                </FieldNoAddons>
            </React.Fragment>
        );
    }
    
    return (
        <div className="has-text-white" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '1.5rem 1.5rem' }}>
            {state.initialDataLoaded 
                ?   <React.Fragment>
                        <CurrentNotifications 
                            statusLastUpdatedTime={(state.currentStatus ? state.currentStatus.createdAt : null)} 
                            mostRecentNotifications={state.mostRecentNotifications}  
                            refreshStatuses={refreshStatuses}
                        />
                        <div>
                            <hr style={{ width: '30%', margin: '1.5rem auto', height: '1px', backgroundColor: 'rgba(112, 112, 112, 1)' }} />
                        </div>
                        <div className={(state.loading || state.error ? "is-hidden" : "" )}>
                            <div className="is-size-5 has-text-weight-semibold" style={{ marginTop: '1.5rem' }}>
                                Your AM Train
                            </div>
                            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                                {amData}
                            </div>
                            <div>
                                <hr style={{ width: '30%', margin: '1.5rem auto', height: '1px', backgroundColor: 'rgba(112, 112, 112, 1)' }} />
                            </div>
                            <div className="is-size-5 has-text-weight-semibold" style={{ marginTop: '1.5rem' }}>
                                Your PM Train
                            </div>
                            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                                {pmData}
                            </div>
                        </div>
                    </React.Fragment>
                :   <div className="has-text-white" style={{ display: 'flex', justifyContent: 'center' }}>Loading...</div>
            }
        </div>
    );
}

export default Dashboard;