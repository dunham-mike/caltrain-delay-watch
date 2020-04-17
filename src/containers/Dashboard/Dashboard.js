import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { store } from '../../store/store';

const Dashboard = (props) => {
    const context = useContext(store);
    const { state } = context;

    let amData = (
        <RouterLink to={{ 
            pathname: '/watch-commute',
            state: {
                commuteType: 'AM'
            }
        }}>
            <button class="button is-warning is-outlined">Set up your morning commute to watch!</button>
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

    let pmData = (
        <RouterLink to={{ 
            pathname: '/watch-commute',
            state: {
                commuteType: 'PM'
            }
        }}>
            <button class="button is-info is-outlined">Set up your evening commute to watch!</button>
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
            <div class="is-size-5 has-text-weight-semibold">
                No Current Alerts
            </div>
            <div class="is-size-7 has-text-weight-light">
                Last Updated: Today at 8:17 am
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
                <span style={{ margin: 'auto 0' }}>Happy commuting!</span>
                <span style={{fontSize: '35px', color: 'black' }} role="img" aria-label="Rock on emoji">&#129304;</span>
                <span style={{fontSize: '35px', color: 'black' }} role="img" aria-label="Train emoji">&#128649;</span>
            </div>
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