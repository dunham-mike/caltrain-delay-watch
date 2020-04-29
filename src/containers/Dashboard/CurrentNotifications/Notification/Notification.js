import React from 'react';
import moment from 'moment-timezone';

const Notification = (props) => {

    let stationUrlText = null;
    switch(props.notification.station) {
        case 'Millbrae':
            stationUrlText = 'millbraetransitcenter';
            break;
        case 'California Ave':
            stationUrlText = 'californiaavenuestation';
            break;
        default:
            stationUrlText = props.notification.station.toLowerCase().split(' ').join('') + 'station';
            break;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }} key={props.notification.station + ' ' + props.notification.trainNumber}>
            <div class="box">
                <div class="content is-size-6">
                    <strong>Delayed:</strong> {props.notification.direction} {props.notification.trainNumber} at {props.notification.station} Station<br/>
                    <ul style={{ listStyle: 'disc', paddingLeft: '30px' }}>
                        <li class="has-text-primary">Expected Departure: {moment.utc(props.notification.expectedDepartureTime).tz("America/Los_Angeles").format('h:mm a')}</li>
                        <li>Originally Scheduled Departure: {moment.utc(props.notification.scheduledDepartureTime).tz("America/Los_Angeles").format('h:mm a')}</li>
                    </ul> 
                    <strong>More Info:</strong>
                    <ul style={{ listStyle: 'disc', paddingLeft: '30px' }}>
                        <li><a href={`http://www.caltrain.com/stations/${stationUrlText}.html`} 
                            target="_blank" rel="noopener noreferrer">Real-time Train Info and Alerts for {props.notification.station} Station</a></li>
                        <li>
                        <a href="https://twitter.com/Caltrain" target="_blank" rel="noopener noreferrer">Caltrain Twitter Feed</a>
                        </li>
                    </ul> 
                </div>
            </div>
        </div>
    )
}

export default Notification;