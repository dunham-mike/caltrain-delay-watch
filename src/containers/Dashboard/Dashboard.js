import React, { useContext, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import moment from 'moment-timezone';

import TrainWatched from './TrainWatched/TrainWatched';
import CurrentNotifications from './CurrentNotifications/CurrentNotifications';
import { store } from '../../store/store';

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

// TODO: Add section for most recent notifications and a recent one, if it exists.

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

    useEffect(() => {
        if(state.loading === false && state.error === null & state.initialDataLoaded === false) {

            const fetchInitialData = async () => {
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

                    dispatch({ type: 'INITIAL_LOADING_COMPLETE' });
                } else {
                    dispatch({ type: 'SET_ERROR', error: 'Loading Watched Trains and Notifications for user failed.' });
                }
            }

            fetchInitialData();
        }
    }, [state.loading, state.error, state.initialDataLoaded, dispatch, fetchUserData, fetchCurrentStatus]);

    // AM Commute Data

    let amData = (
        <RouterLink to={{ 
            pathname: '/watch-commute',
            state: {
                commuteType: 'AM'
            }
        }}>
            <button class="button is-warning is-outlined">Select a morning train to watch!</button>
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
                    />
                </FieldHasAddons>
                <FieldNoAddons>
                    <TrainWatched 
                        hasAddons={false}
                        commuteType="AM"
                        trainWatched={state.amTrainWatched}
                    />
                </FieldNoAddons>
            </React.Fragment>
        );
    }

    // PM Commute Data

    let pmData = (
        <RouterLink to={{ 
            pathname: '/watch-commute',
            state: {
                commuteType: 'PM'
            }
        }}>
            <button class="button is-info is-outlined">Select an evening train to watch!</button>
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
                    />
                </FieldHasAddons>
                <FieldNoAddons>
                    <TrainWatched 
                        hasAddons={false}
                        commuteType="PM"
                        trainWatched={state.pmTrainWatched}
                    />
                </FieldNoAddons>
            </React.Fragment>
        );
    }
    
    return (
        <div class="has-text-white" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '0.75rem 1.5rem' }}>
            {state.initialDataLoaded 
                ?   <React.Fragment>
                        <CurrentNotifications 
                            statusLastUpdatedTime={(state.currentStatus ? state.currentStatus.createdAt : null)} 
                            mostRecentNotifications={state.mostRecentNotifications}  
                        />
                        <div>
                            <hr style={{ width: '30%', margin: '1.5rem auto', height: '1px', backgroundColor: 'rgba(112, 112, 112, 1)' }} />
                        </div>
                        <div class={(state.loading || state.error ? "is-hidden" : "" )}>
                            <div class="is-size-5 has-text-weight-semibold" style={{ marginTop: '1.5rem' }}>
                                Your AM Train
                            </div>
                            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                                {amData}
                            </div>
                            <div>
                                <hr style={{ width: '30%', margin: '1.5rem auto', height: '1px', backgroundColor: 'rgba(112, 112, 112, 1)' }} />
                            </div>
                            <div class="is-size-5 has-text-weight-semibold" style={{ marginTop: '1.5rem' }}>
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