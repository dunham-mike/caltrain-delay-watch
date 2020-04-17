import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import moment from 'moment-timezone';

import { store } from '../../store/store';

const Dashboard = (props) => {
    const context = useContext(store);
    const { state } = context;

    let lastAlertUpdateTimeText = null;

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
            <div class="field has-addons">      
                <p class="control">
                    <RouterLink to={{ 
                        pathname: '/watch-commute',
                        state: { commuteType: 'AM' }
                    }}>
                        <button class="button is-warning is-light has-text-weight-bold">
                            {state.amTrainWatched.station 
                                + ' Station: ' 
                                + (state.amTrainWatched.direction === "Northbound" ? "NB" : "SB") + ' ' 
                                + state.amTrainWatched.trainNumber + ' at ' + state.amTrainWatched.time
                            }
                        </button>
                    </RouterLink>
                </p>
                <p class="control">
                    <RouterLink to={{ 
                        pathname: '/watch-commute',
                        state: {
                            commuteType: 'AM'
                        }
                    }}>
                        <button class="button is-warning">Edit</button>
                    </RouterLink>
                </p>
            </div>
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
            <div class="field has-addons">      
                <p class="control">
                    <RouterLink to={{ 
                        pathname: '/watch-commute',
                        state: { commuteType: 'PM' }
                    }}>
                        <button class="button is-info is-light has-text-weight-bold">
                            {state.pmTrainWatched.station 
                                + ' Station: ' 
                                + (state.pmTrainWatched.direction === "Northbound" ? "NB" : "SB") + ' ' 
                                + state.pmTrainWatched.trainNumber + ' at ' + state.pmTrainWatched.time
                            }
                        </button>
                    </RouterLink>
                </p>
                <p class="control">
                    <RouterLink to={{ 
                        pathname: '/watch-commute',
                        state: { commuteType: 'PM' }
                    }}>
                        <button class="button is-info">Edit</button>
                        </RouterLink>
                </p>
            </div>
        );
    }
    
    return (
        <div class="has-text-white" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '0.75rem 1.5rem' }}>
            {alertData}
            <div>
                <hr style={{ width: '30%', margin: '1.5rem auto', height: '1px', backgroundColor: 'rgba(112, 112, 112, 1)' }} />
            </div>
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
    );
}

export default Dashboard;