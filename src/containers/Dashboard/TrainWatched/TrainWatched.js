import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const TrainWatched = (props) => {
    let trainWatchedText = props.trainWatched.station 
        + (props.hasAddons ? ' Station: ' : ': ')
        + (props.trainWatched.direction === "NB" ? "NB" : "SB") + ' ' 
        + props.trainWatched.trainNumber + ' at ' + props.trainWatched.time;

    return (
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
    );
}

export default TrainWatched;