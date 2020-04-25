import React, { useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import moment from 'moment-timezone';

import TrainWatched from './TrainWatched/TrainWatched';
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

const Dashboard = (props) => {
    const context = useContext(store);
    const { dispatch, state } = context;

    let lastAlertUpdateTimeText = null;

    // Load Data

    useEffect(() => {
        if(state.loading === false && state.error === null & state.initialDataLoaded === false) {
            dispatch({ type: 'INITIATE_LOADING_USER_DATA' });
            console.log('fire API call to load initial user data!');

            axios.get('http://localhost:8082/api/watched-trains',
                   { headers: { 'Authorization': `Bearer ${state.token}` } }
                )
                .then(fetchResponse => {
                    console.log('fetchResponse:', fetchResponse);
                    dispatch({ 
                        type: 'LOAD_USER_DATA', 
                        amTrainWatched: (fetchResponse.data.amWatchedTrain ? fetchResponse.data.amWatchedTrain.trainInfo : null), 
                        pmTrainWatched: (fetchResponse.data.pmWatchedTrain ? fetchResponse.data.pmWatchedTrain.trainInfo : null) });
                })
                .catch(fetchError => {
                    console.log('[Error] Loading Watched Trains for user failed:', fetchError);
                    dispatch({ type: 'SET_ERROR', error: 'Loading Watched Trains for user failed.' });
                });
        }
    }, [state.loading, state.error, state.initialDataLoaded, dispatch, state.token]);

    // Alert Data

    if(state.lastAlertUpdateTime) {
        if( moment(state.lastAlertUpdateTime).tz("America/Los_Angeles").isSame(moment().tz("America/Los_Angeles"), 'day') ) {
            lastAlertUpdateTimeText = 'Last Updated: Today at ' + state.lastAlertUpdateTime.format('h:mm a');
        } else {
            lastAlertUpdateTimeText = 'Last Updated: ' + moment(state.lastAlertUpdateTime).tz("America/Los_Angeles").format('ddd., MMM. Do [at] h:mm a');
        }
    }

    let alertData = (
        <React.Fragment>
            <div class="is-size-5 has-text-weight-semibold">
                No Current Alerts
            </div>
            <div class="is-size-7 has-text-weight-light">
                {lastAlertUpdateTimeText}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
                <span style={{ margin: 'auto 0' }}>Happy commuting!</span>
                <span style={{fontSize: '35px', color: 'black' }} role="img" aria-label="Rock on emoji">&#129304;</span>
                <span style={{fontSize: '35px', color: 'black' }} role="img" aria-label="Train emoji">&#128649;</span>
            </div>
        </React.Fragment>
    );

    // TODO: Move alert into its own component and make station link dynamic
    if(state.currentAlert !== null) {
        if(moment(state.currentAlert.calendarDate).tz("America/Los_Angeles").isSame(moment().tz("America/Los_Angeles"), 'day')) {
            alertData = (
                <React.Fragment>
                    <div class="is-size-5 has-text-weight-semibold has-text-primary">
                        Current Alert
                    </div>
                    <div class="is-size-7 has-text-weight-light">
                        {lastAlertUpdateTimeText}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
                        <div class="box">
                            <div class="content">
                                <strong>Delayed:</strong> {state.currentAlert.train.direction} {state.currentAlert.train.trainNumber} at {state.currentAlert.train.station} Station<br/>
                                <ul style={{ listStyle: 'disc', paddingLeft: '30px' }}>
                                    <li class="has-text-primary">Currently Expected Arrival: {state.currentAlert.expectedArrivalTime}</li>
                                    <li>Originally Scheduled Arrival: {state.currentAlert.train.time}</li>
                                </ul> 
                                <strong>More Info:</strong>
                                <ul style={{ listStyle: 'disc', paddingLeft: '30px' }}>
                                    <li><a href="http://www.caltrain.com/stations/burlingamestation.html" target="_blank" rel="noopener noreferrer" >Real-time Train Info and Alerts for Burlingame Station</a></li>
                                    <li>
                                    <a href="https://twitter.com/Caltrain" target="_blank" rel="noopener noreferrer" >Caltrain Twitter Feed</a>
                                    </li>
                                </ul> 
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
        console.log(state.currentAlert);
    }

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
            {alertData}
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
        </div>
    );
}

export default Dashboard;