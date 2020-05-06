import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrain, faLongArrowAltUp, faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons';

const UpdateCommute = (props) => {
    return(
        <div style={{ marginTop: '1.5rem' }}>
            <div className="is-size-5 has-text-weight-semibold">Update {props.commuteType} Commute</div>
            <div className="columns" style={{ marginTop: '1.5rem' }}>
                <div className="column" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="field">
                        <p className="control has-icons-left">
                            <span className="select">
                                <select onChange={props.changeStationHandler} value={(props.station ? props.station : '')}>
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
                                onClick={()=> props.changeDirectionHandler('NB')}
                                className={"button is-success" + (props.direction !== "NB" ? ' is-outlined' : '')}
                            >
                                <span className="icon">
                                    <FontAwesomeIcon icon={faLongArrowAltUp} style={{ fontSize: '20px'}} />                                
                                </span>
                                <span>Northbound</span>
                            </button>
                        </p>
                        <p className="control">
                            <button 
                                onClick={()=> props.changeDirectionHandler('SB')}
                                className={"button is-warning" + (props.direction !== "SB" ? ' is-outlined' : '')}
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
            {props.trainSchedule}
            {props.deleteTrainButton}
        </div>
    );
}

export default UpdateCommute;