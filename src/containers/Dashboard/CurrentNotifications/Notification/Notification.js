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
            <div className="box">
                <div className="content is-size-6">
                    <div className="has-text-centered">
                        <strong>Delayed:</strong> {props.notification.direction} {props.notification.trainNumber} at {props.notification.station} Station<br/>
                    </div>
                    
                    <div>
                        <hr style={{ width: '80%', margin: '0.75rem auto', height: '1px', backgroundColor: 'rgba(112, 112, 112, 1)' }} />
                    </div>
                    <div>
                        <strong>Notification Sent:</strong> {moment.utc(props.notification.createdAt).tz("America/Los_Angeles").format("h:mm a")}
                    </div>
                    <strong>More Info:</strong>
                    <ul style={{ listStyle: 'disc', paddingLeft: '30px' }}>
                        <li><a href={`http://www.caltrain.com/stations/${stationUrlText}.html`} 
                            target="_blank" rel="noopener noreferrer">Official Real-time Info and Alerts for {props.notification.station} Station</a></li>
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