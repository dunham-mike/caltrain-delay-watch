import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import { store } from '../../store/store';
import { getTimetables, updateWatchedTrain } from '../../services/backendService';

import CurrentTrain from './CurrentTrain/CurrentTrain';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import UpdateCommute from './UpdateCommute/UpdateCommute';
import PageContainer from '../PageContainer/PageContainer';

const operator = 'Caltrain';
const scheduleType = 'Weekday';

const WatchCommute = (props) => {
    // Setting Up Data From Store
    const context = useContext(store);
    const { dispatch, state } = context;

    // Load Timetables
    useEffect(() => {
        if(state.timetables.weekday === null) {
            (async function() {
                await getTimetables(dispatch, state.token);
            }());
        }
    }, [state.timetables.weekday, dispatch, state.token]);

    // Setting Up Data Passed Via RouterLink
    let commuteType = 'AM';
    if(props.location.state) {
        commuteType = props.location.state.commuteType;
    }

    let selectedTrain = state.amTrainWatched;
    if(commuteType === 'PM') {
        selectedTrain = state.pmTrainWatched;
    }

    let history = useHistory();
    const selectTrainHandler = async (train) => {
        await updateWatchedTrain(train, commuteType, operator, scheduleType, dispatch, state.token);
        history.push('/');
    }

    const getActiveTrainsFromState = (activeStation, activeDirection, activeTimeframe, commuteType) => {
        const amTrains = [];
        const pmTrains = [];

        let shortActiveDirection = null;
        if(activeDirection === "NB") {
            shortActiveDirection = "NB";
        } else if(activeDirection === "SB") {
            shortActiveDirection = "SB";
        } else {
            return [];
        }

        const timetablesData = state.timetables[activeTimeframe];

        if(timetablesData !== null) {
            /*
                timetablesData format:
                {
                    70011: {
                        direction: 'NB',
                        stationName: 'San Francisco',
                        timetable: [ { arrivalTime: '06:03:00', trainNumber: '101' }, ... ]
                    }
                }
            */

            const stopIdKeys = Object.keys(timetablesData);

            let stopId = null;
            for(let i=0; i<stopIdKeys.length; i++) {
                const stopData = timetablesData[stopIdKeys[i]];

                if(stopData.stationName === activeStation && stopData.direction === shortActiveDirection) {
                    stopId = stopIdKeys[i];
                    break;
                }
            }

            const stationTimetable = timetablesData[stopId].timetable;
            for(let j=0; j<stationTimetable.length; j++) {
                const trainObject = {
                    station: activeStation,
                    stopId: stopId,
                    direction: (shortActiveDirection === 'NB' ? 'NB' : 'SB'),
                    time: moment('1970-01-01 ' + stationTimetable[j].arrivalTime).format('h:mm a'),
                    trainNumber: stationTimetable[j].trainNumber,
                };

                if(moment('1970-01-01 ' + trainObject.time).isBefore(moment('1970-01-01 12:00 pm'))) {
                    amTrains.push(trainObject);
                } else {
                    pmTrains.push(trainObject);
                }
            }
        }

        if(commuteType === "AM") {
            return amTrains.concat(pmTrains);
        } else {
            return pmTrains.concat(amTrains);
        }
    }

    return (
        <PageContainer>
            <CurrentTrain 
                commuteType={commuteType}
                selectedTrain={selectedTrain}
            />
            <HorizontalRule />
            <UpdateCommute 
                commuteType={commuteType}
                loading={state.loading}
                selectedTrain={selectedTrain}
                selectTrainHandler={selectTrainHandler}
                getActiveTrainsFromState={getActiveTrainsFromState}
            />
        </PageContainer>
    );
}

export default WatchCommute;