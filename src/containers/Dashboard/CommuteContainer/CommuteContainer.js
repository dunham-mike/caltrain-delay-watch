import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

import TrainWatched from './TrainWatched/TrainWatched';

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

const CommuteContainer = (props) => {

    let trainWatchedElement = (
        <RouterLink to={{ 
            pathname: '/watch-commute',
            state: {
                commuteType: props.commuteType
            }
        }}>
            <button className={"button is-outlined " + (props.commuteType === 'AM' ? 'is-warning' : 'is-info' )}>
                Select {(props.commuteType === 'AM' ? 'a morning' : 'an evening' )} train to watch!
            </button>
        </RouterLink>
    );

    if(props.trainWatched) {
        trainWatchedElement = (
            <React.Fragment>
                <FieldHasAddons>  
                    <TrainWatched 
                        hasAddons={true}
                        commuteType={props.commuteType}
                        trainWatched={props.trainWatched}
                        trainStatus={props.trainStatus}
                    />
                </FieldHasAddons>
                <FieldNoAddons>
                    <TrainWatched 
                        hasAddons={false}
                        commuteType={props.commuteType}
                        trainWatched={props.trainWatched}
                        trainStatus={props.trainStatus}
                    />
                </FieldNoAddons>
            </React.Fragment>
        );
    }

    return(
        <React.Fragment>
            <div className="is-size-5 has-text-weight-semibold has-text-white" style={{ marginTop: '1.5rem' }}>
                Your {props.commuteType} Train
            </div>
            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                {trainWatchedElement}
            </div>
        </React.Fragment>
    );
}

export default CommuteContainer;