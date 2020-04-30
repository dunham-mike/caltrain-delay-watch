import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import moment from 'moment-timezone';

const TrainWatched = (props) => {
    let trainWatchedText = props.trainWatched.station 
        + (props.hasAddons ? ' Station: ' : ': ')
        + (props.trainWatched.direction === "NB" ? "NB" : "SB") + ' ' 
        + props.trainWatched.trainNumber + ' at ' + props.trainWatched.time;
    
    let trainStatusDisplay = null;

    if(props.trainStatus) {
        trainStatusDisplay = (
            <div className="has-text-white has-text-centered">
                <span className={
                    "has-text-weight-bold " 
                    + (props.trainStatus.status !== "On Time" ? (props.trainStatus.minutesLate >= 10 ? "has-text-primary" : "has-text-warning") : "has-text-white")}
                >
                    {props.trainStatus.status}
                </span> - Expected Departure: {moment.utc(props.trainStatus.expectedDepartureTime).tz('America/Los_Angeles').format('h:mm a')}
            </div>
        );
    }

    return (
        <React.Fragment>
        <div className={"field" + (props.hasAddons ? " has-addons" : "")} style={props.hasAddons ? {} : { display: 'flex', flexDirection: 'column', alignItems: 'center' } }>
            <p className="control">
                <RouterLink to={{ 
                    pathname: '/watch-commute',
                    state: { commuteType: props.commuteType }
                }}>
                    <button 
                        className={
                            "button is-light has-text-weight-bold " 
                            + (props.commuteType === "AM" ? "is-warning" : "is-info")
                            // + (trainWatchedText.length > 40 ? " is-small" : "")
                    }>
                        {trainWatchedText}
                    </button>
                </RouterLink>
            </p>
            <p className="control">
                <RouterLink to={{ 
                    pathname: '/watch-commute',
                    state: {
                        commuteType: props.commuteType
                    }
                }}>
                    <button className={"button " + (props.commuteType === "AM" ? "is-warning" : "is-info")}
                        style={(props.hasAddons ? {} : { marginTop: '0.75rem'} )}
                    >Edit</button>
                </RouterLink>
            </p>
        </div>
        {trainStatusDisplay}
        </React.Fragment>
    );
}

export default TrainWatched;