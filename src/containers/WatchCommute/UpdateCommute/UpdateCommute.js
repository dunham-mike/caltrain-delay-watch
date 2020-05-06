import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrain, faLongArrowAltUp, faLongArrowAltDown, faWindowClose } from '@fortawesome/free-solid-svg-icons';

const UpdateCommute = (props) => {

    // Managing Local State
    const [station, setStation] = useState(null);
    const [direction, setDirection] = useState(null);
    const [maxTrainsToShow, setMaxTrainsToShow] = useState(10);

    const changeStationHandler = (event) => {
        if (event.target.value === "Select Your Station") {
            setStation(null);
        } else {
            setStation(event.target.value);
        }
    }

    const changeDirectionHandler = (newDirection) => {
        if (direction !== newDirection) {
            setDirection(newDirection);
        }
    }

    const showMoreTrainsHandler = () => {
        setMaxTrainsToShow(prevState => prevState + 10);
    }

    let activeTrains = [];
    if(station !== null && direction !== null) {
        activeTrains = props.getActiveTrainsFromState(station, direction, 'weekday', props.commuteType);
    }

    // Conditional JSX Elements
    let deleteTrainButton = null;
    if(props.selectedTrain !== null) {
        deleteTrainButton = (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4.5rem' }}>
                <button className={"button is-primary is-outlined" + (props.loading ? " is-loading" : "")} onClick={() => props.selectTrainHandler(null)}>
                    <span className="icon">
                        <FontAwesomeIcon icon={faWindowClose} />                                
                    </span>
                    <span>Or Delete Current Train</span>
                </button>
            </div>
        );
    }

    let trainSchedule = null;

    if(station !== null && direction !== null) {
        if(activeTrains.length === 0) {
            trainSchedule = (
                <React.Fragment>
                    <div className="has-text-weight-semibold has-text-centered" style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                        Cannot find any trains for that station and direction of travel. Please try another.
                    </div>
                </React.Fragment>
            )
        } else {
            const maxTrainsToShowPerColumn = Math.ceil(Math.min(maxTrainsToShow, activeTrains.length) / 2);

            const trainElements = activeTrains.map(train => {
                return (
                    <button 
                        className={"button is-info" 
                            + (props.selectedTrain !== null && train.trainNumber === props.selectedTrain.trainNumber && train.time === props.selectedTrain.time ? '' : " is-outlined")
                        } 
                        style={{ width: '200px', margin: '0.1875rem' }} 
                        key={train.trainNumber}
                        onClick={() => props.selectTrainHandler(train)}
                    >
                        {train.time} - {train.direction === "NB" ? 'NB' : 'SB'} {train.trainNumber}
                    </button>
                );
            })

            const firstHalfTrainElements = trainElements.slice(0, maxTrainsToShowPerColumn);
            const secondHalfTrainElements = trainElements.slice(maxTrainsToShowPerColumn, maxTrainsToShow);

            let showMoreTimesButton = null;

            if(activeTrains.length > maxTrainsToShow) {
                showMoreTimesButton = (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <button className="button is-warning is-outlined" style={{ width: '200px', margin: '0.1875rem' }} onClick={showMoreTrainsHandler}>Show More Times</button>
                    </div>
                );
            }

            trainSchedule = (
                <React.Fragment>
                    <div className="has-text-weight-semibold" style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Choose Train to Watch:</div>
                    <div className="columns" style={{ marginTop: '0.75rem', marginBottom: '0' }}>
                        <div className="column is-6" style={{ margin: '0', padding: '0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {firstHalfTrainElements}
                            </div>
                        </div>
                        <div className="column is-6" style={{ margin: '0', padding: '0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {secondHalfTrainElements}
                            </div>
                        </div>
                    </div>
                    {showMoreTimesButton}
                </React.Fragment>
            );
        }
    }

    return(
        <div className="has-text-white" style={{ marginTop: '1.5rem' }}>
            <div className="is-size-5 has-text-weight-semibold">Update {props.commuteType} Commute</div>
            <div className="columns" style={{ marginTop: '1.5rem' }}>
                <div className="column" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="field">
                        <p className="control has-icons-left">
                            <span className="select">
                                <select onChange={changeStationHandler} value={(station ? station : '')}>
                                    <option>Select Your Boarding Station</option>

                                    <optgroup label="Zone 1">
                                        <option value="San Francisco">San Francisco</option>
                                        <option value="22nd Street">22nd Street</option>
                                        <option value="Bayshore">Bayshore</option>
                                        <option value="South San Francisco">South San Francisco</option>
                                        <option value="San Bruno">San Bruno</option>
                                    </optgroup>

                                    <optgroup label="Zone 2">
                                        <option value="Millbrae">Millbrae</option>
                                        {/* Skipping Broadway (Weekend Only) */}
                                        <option value="Burlingame">Burlingame</option>
                                        <option value="San Mateo">San Mateo</option>
                                        <option value="Hayward Park">Hayward Park</option>
                                        <option value="Hillsdale">Hillsdale</option>
                                        <option value="Belmont">Belmont</option>
                                        <option value="San Carlos">San Carlos</option>
                                        <option value="Redwood City">Redwood City</option>
                                    </optgroup>

                                    <optgroup label="Zone 3">
                                        {/* Skipping Atherton (Weekend Only) */}
                                        <option value="Menlo Park">Menlo Park</option>
                                        <option value="Palo Alto">Palo Alto</option>
                                        {/* Skipping Stanford (Football Only) */}
                                        <option value="California Ave.">California Ave.</option>
                                        <option value="San Antonio">San Antonio</option>
                                        <option value="Mountain View">Mountain View</option>
                                        <option value="Sunnyvale">Sunnyvale</option>
                                    </optgroup>

                                    <optgroup label="Zone 4">
                                        <option value="Lawrence">Lawrence</option>
                                        <option value="Santa Clara">Santa Clara</option>
                                        <option value="College Park">College Park</option>
                                        <option value="San Jose Diridon">San Jose Diridon</option>
                                        <option value="Tamien">Tamien</option>
                                    </optgroup>

                                    <optgroup label="Zone 5">
                                        <option value="Capitol">Capitol</option>
                                        <option value="Blossom Hill">Blossom Hill</option>
                                    </optgroup>

                                    <optgroup label="Zone 6">
                                        <option value="Morgan Hill">Morgan Hill</option>
                                        <option value="San Martin">San Martin</option>
                                        <option value="Gilroy">Gilroy</option>
                                    </optgroup>

                                </select>
                            </span>
                            <span className="icon is-left" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesomeIcon icon={faTrain} style={{ fontSize: '20px'}} />                                
                            </span>
                        </p>
                    </div>
                </div>
                <div className="column" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="field has-addons">
                        <p className="control">
                            <button 
                                onClick={()=> changeDirectionHandler('NB')}
                                className={"button is-success" + (direction !== "NB" ? ' is-outlined' : '')}
                            >
                                <span className="icon">
                                    <FontAwesomeIcon icon={faLongArrowAltUp} style={{ fontSize: '20px'}} />                                
                                </span>
                                <span>Northbound</span>
                            </button>
                        </p>
                        <p className="control">
                            <button 
                                onClick={()=> changeDirectionHandler('SB')}
                                className={"button is-warning" + (direction !== "SB" ? ' is-outlined' : '')}
                            >
                                <span>Southbound</span>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faLongArrowAltDown} style={{ fontSize: '20px'}} />                                
                                </span>
                            </button>
                        </p>

                    </div>
                    
                </div>
            </div>
            {trainSchedule}
            {deleteTrainButton}
        </div>
    );
}

export default UpdateCommute;