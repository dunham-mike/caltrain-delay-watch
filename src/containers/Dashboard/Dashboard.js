import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment-timezone';

import { store } from '../../store/store';
import { getUserDataAndCurrentStatus } from '../../services/backendService';

import CurrentNotifications from './CurrentNotifications/CurrentNotifications';
import Modal from '../../components/Modal/Modal';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import CommuteContainer from './CommuteContainer/CommuteContainer';
import PageContainer from '../PageContainer/PageContainer';

const Dashboard = () => {
    const context = useContext(store);
    const { dispatch, state } = context;

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);

    // Load Initial Data
    useEffect(() => {
        if(state.initialDataLoaded === false) {
            const fetchInitialData = async () => {

                const isInitialLoadSuccessful = await getUserDataAndCurrentStatus(dispatch, state.token);
                if (isInitialLoadSuccessful) {
                    dispatch({ type: 'INITIAL_DATA_LOADED' });

                    if(state.amTrainWatched === null && state.pmTrainWatched === null) {
                        setModalMessage('Set up your commute to receive a notification any time your train is running more than 10 minutes late.\n\n' 
                        + 'You can also update your preferred notification method under Settings. Happy commuting!');
                    }
                }
            }

            fetchInitialData();
        }
    }, [dispatch, state.token, state.amTrainWatched, state.pmTrainWatched, state.initialDataLoaded]);

    // Refresh statuses
    const refreshStatuses = async () => {
        const dayOfWeek = moment.utc().tz('America/Los_Angeles').day();

        if(state.currentStatus && moment.utc().isBefore(moment.utc(state.currentStatus.createdAt).add(5, 'minutes'))) {
            setModalMessage(
                'New status updates are available every 5 minutes on weekdays. Please try again after ' 
                + moment.utc(state.currentStatus.createdAt).tz("America/Los_Angeles").add(5, 'minutes').format('h:mm a') + '.'
            );
        } else if(dayOfWeek === 0 || dayOfWeek === 6) {
            setModalMessage(
                'New status updates are available every 5 minutes on weekdays. Please try again on Monday.'
            );
        } else {
            setIsRefreshing(true);
            const isRefreshSuccessful = await getUserDataAndCurrentStatus(dispatch, state.token);
            setIsRefreshing(false);
            if(!isRefreshSuccessful) {
                dispatch({ type: 'SET_ERROR', error: 'Unable to refresh data.' });
            }
        }
    }

    const closeModal = () => {
        setModalMessage(null);
    }

    // Update train statuses if needed
    if(state.currentStatus && moment.utc(state.currentStatus.createdAt).isAfter(moment.utc().subtract(30, 'minutes'))
        && (state.lastTrainStatusUpdate === null 
                || moment.utc(state.currentStatus.createdAt).isAfter(moment.utc(state.lastTrainStatusUpdate))
            )
    ) {
        const currentStatuses = state.currentStatus.currentStatuses;
        let amStatusFound = false;
        let pmStatusFound = false;

        for(let i=0; i<currentStatuses.length; i++) {
            const thisCurrentStatus = currentStatuses[i];

            if(state.amTrainWatched !== null 
                && !amStatusFound 
                && thisCurrentStatus.station === state.amTrainWatched.station
                && thisCurrentStatus.direction === state.amTrainWatched.direction
                && thisCurrentStatus.trainNumber === state.amTrainWatched.trainNumber
            ) {
                amStatusFound = true;

                if(state.amTrainStatus === null 
                    || thisCurrentStatus.expectedDepartureTime !== state.amTrainStatus.expectedDepartureTime 
                ) {
                    dispatch({ 
                        type: 'UPDATE_TRAIN_STATUS', 
                        commuteType: 'AM', 
                        status: thisCurrentStatus,
                     })
                }

            } else if(state.pmTrainWatched !== null 
                && !pmStatusFound 
                && thisCurrentStatus.station === state.pmTrainWatched.station
                && thisCurrentStatus.direction === state.pmTrainWatched.direction
                && thisCurrentStatus.trainNumber === state.pmTrainWatched.trainNumber
            ) {
                pmStatusFound = true;

                if(state.pmTrainStatus === null 
                    || thisCurrentStatus.expectedDepartureTime !== state.pmTrainStatus.expectedDepartureTime 
                ) {

                    dispatch({ 
                        type: 'UPDATE_TRAIN_STATUS', 
                        commuteType: 'PM', 
                        status: thisCurrentStatus,
                    })
                }
            }
        }

        if(!amStatusFound && state.amTrainStatus !== null) {
            dispatch({ 
                type: 'UPDATE_TRAIN_STATUS', 
                commuteType: 'AM', 
                status: null,
             })
        }

        if(!pmStatusFound && state.pmTrainStatus !== null) {
            dispatch({ 
                type: 'UPDATE_TRAIN_STATUS', 
                commuteType: 'PM', 
                status: null,
             })
        }
    }
    
    return (
        <PageContainer>
            <div className={(!state.initialDataLoaded || state.error ? "is-hidden" : "" )}>    
                <Modal modalMessage={modalMessage} closeModal={closeModal} isErrorModal={false} />
                <CurrentNotifications 
                    statusLastUpdatedTime={(state.currentStatus ? state.currentStatus.createdAt : null)} 
                    mostRecentNotifications={state.mostRecentNotifications}  
                    refreshStatuses={refreshStatuses}
                    isRefreshing={isRefreshing}
                />
                <HorizontalRule />
                <CommuteContainer
                    commuteType={"AM"}
                    trainWatched={state.amTrainWatched}
                    trainStatus={state.amTrainStatus}
                />
                <HorizontalRule />
                <CommuteContainer
                    commuteType={"PM"}
                    trainWatched={state.pmTrainWatched}
                    trainStatus={state.pmTrainStatus}
                />
            </div>
        </PageContainer>
    );
}

export default Dashboard;