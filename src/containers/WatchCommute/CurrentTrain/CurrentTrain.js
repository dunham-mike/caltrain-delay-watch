import React from 'react';
import styled from 'styled-components';

const RegularCurrentTrain = styled.button`
    @media (max-width: 480px) {
        display: none;
    }
`

const ShortenedCurrentTrain = styled.button`
    @media (min-width: 481px) {
        display: none;
    }
`

const CurrentTrain = (props) => {
    let selectedTrainText = '(none)';
    let shortenedSelectedTrainText = '(none)';

    if(props.selectedTrain !== null) {
        selectedTrainText = props.selectedTrain.station 
            + ' Station: ' 
            + (props.selectedTrain.direction === "NB" ? "NB" : "SB") + ' ' 
            + props.selectedTrain.trainNumber + ' at ' + props.selectedTrain.time;
        
        shortenedSelectedTrainText = props.selectedTrain.station + ': '
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
                    <RegularCurrentTrain className={"button is-light has-text-weight-bold " + (props.commuteType === "AM" ? "is-warning" : "is-info" )}>
                        {selectedTrainText}
                    </RegularCurrentTrain>  
                    <ShortenedCurrentTrain className={"button is-light has-text-weight-bold " + (props.commuteType === "AM" ? "is-warning" : "is-info" )}>
                        {shortenedSelectedTrainText}
                    </ShortenedCurrentTrain>                    
                </div>
            </div>
        </div>
    );
}

export default CurrentTrain;