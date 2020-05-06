import React from 'react';

const CurrentTrain = (props) => {
    let selectedTrainText = '(none)';

    if(props.selectedTrain !== null) {
        selectedTrainText = props.selectedTrain.station 
            + ' Station: ' 
            + (props.selectedTrain.direction === "NB" ? "NB" : "SB") + ' ' 
            + props.selectedTrain.trainNumber + ' at ' + props.selectedTrain.time;
    }

    return(
        <div className="has-text-white">
            <div className="is-size-5 has-text-weight-semibold">Watch Commute</div>
            <div className="columns" style={{ marginTop: '0' }}>
                <div className="column is-3" style={{ display: 'flex', alignItems: 'center' }}>
                    <div>Current {props.commuteType} Train: </div>
                </div>
                <div className="column" style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className={"button is-info is-light has-text-weight-bold"}>{selectedTrainText}</button>                        
                </div>
            </div>
        </div>
    );
}

export default CurrentTrain;