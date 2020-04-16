import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Dashboard = (props) => {


    return (
        <div class="has-text-white" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '0.75rem 1.5rem' }}>
            <div class="is-size-5 has-text-weight-semibold">
                No Current Alerts
            </div>
            <div class="is-size-7 has-text-weight-light">
                Last Updated: Today at 8:17 am
            </div>
            <div style={{ display: 'flex' }}>
                <span style={{ margin: 'auto 0' }}>Happy commuting!</span>
                <span style={{fontSize: '35px', color: 'black' }} role="img" aria-label="Rock on emoji">&#129304;</span>
                <span style={{fontSize: '35px', color: 'black' }} role="img" aria-label="Train emoji">&#128649;</span>
            </div>
            <div>
                <hr style={{ width: '30%', margin: '1.5rem auto', height: '1px', backgroundColor: 'rgba(112, 112, 112, 1)' }} />
            </div>
            <div class="is-size-5 has-text-weight-semibold" style={{ marginTop: '1.5rem' }}>
                Your AM Commute
            </div>
            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                <RouterLink to={{ 
                    pathname: '/watch-commute',
                    state: {
                        commuteType: 'AM'
                    }
                }}>
                    <button class="button is-warning is-outlined">Set up your morning commute to watch!</button>
                </RouterLink>
            </div>
            <div>
                <hr style={{ width: '30%', margin: '1.5rem auto', height: '1px', backgroundColor: 'rgba(112, 112, 112, 1)' }} />
            </div>
            <div class="is-size-5 has-text-weight-semibold" style={{ marginTop: '1.5rem' }}>
                Your PM Commute
            </div>
            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                <RouterLink to={{ 
                    pathname: '/watch-commute',
                    state: {
                        commuteType: 'PM'
                    }
                }}>
                    <button class="button is-info is-outlined">Set up your evening commute to watch!</button>
                </RouterLink>
            </div>
        </div>
    );
}

export default Dashboard;