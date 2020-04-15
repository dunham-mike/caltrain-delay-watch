import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faTrain, faLongArrowAltUp, faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons';
// import CaltrainMap from '../../images/caltrain-zone-map.png';

const Dashboard = (props) => {
    return (
        <div class="has-text-white" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '0.75rem 1.5rem' }}>
            <div>
                <div class="is-size-5 has-text-weight-semibold">Watch Commute</div>
                <div style={{ marginTop: '0.75rem' }}>Current AM Commute: (none)</div>
            </div>
            <div>
                <hr style={{ width: '30%', margin: '1.5rem auto', height: '1px', backgroundColor: 'rgba(112, 112, 112, 1)' }} />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
                <div class="is-size-5 has-text-weight-semibold">Update AM Commute</div>
                <div class="columns" style={{ marginTop: '1.5rem' }}>
                    <div class="column" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div class="field">
                            <p class="control has-icons-left">
                                <span class="select">
                                    <select>
                                        <option selected>Select Your Station</option>

                                        <optgroup label="Zone 1">
                                            <option>San Francisco</option>
                                            <option>22nd Street</option>
                                            <option>Bayshore</option>
                                            <option>South San Francisco</option>
                                            <option>San Bruno</option>
                                        </optgroup>

                                        <optgroup label="Zone 2">
                                            <option>Millbrae</option>
                                            {/* Skipping Broadway (Weekend Only) */}
                                            <option>Burlingame</option>
                                            <option>San Mateo</option>
                                            <option>Hayward Park</option>
                                            <option>Hillsdale</option>
                                            <option>Belmont</option>
                                            <option>San Carlos</option>
                                            <option>Redwood City</option>
                                        </optgroup>

                                        <optgroup label="Zone 3">
                                            {/* Skipping Atherton (Weekend Only) */}
                                            <option>Menlo Park</option>
                                            <option>Palo Alto</option>
                                            {/* Skipping Stanford (Football Only) */}
                                            <option>California Ave.</option>
                                            <option>San Antonio</option>
                                            <option>Mountain View</option>
                                            <option>Sunnyvale</option>
                                        </optgroup>

                                        <optgroup label="Zone 4">
                                            <option>Lawrence</option>
                                            <option>Santa Clara</option>
                                            <option>College Park</option>
                                            <option>San Jose Diridon</option>
                                            <option>Tamien</option>
                                        </optgroup>

                                        <optgroup label="Zone 5">
                                            <option>Capitol</option>
                                            <option>Blossom Hill</option>
                                        </optgroup>

                                        <optgroup label="Zone 6">
                                            <option>Morgan Hill</option>
                                            <option>San Martin</option>
                                            <option>Gilroy</option>
                                        </optgroup>

                                    </select>
                                </span>
                                <span class="icon is-left" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faTrain} style={{ fontSize: '20px'}} />                                
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class="column" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div class="field has-addons">
                            <p class="control">
                                <button class="button is-success is-outlined">
                                    <span class="icon">
                                        <FontAwesomeIcon icon={faLongArrowAltUp} style={{ fontSize: '20px'}} />                                
                                    </span>
                                    <span>Northbound</span>
                                </button>
                            </p>
                            <p class="control">
                                <button class="button is-warning is-outlined">
                                    <span>Southbound</span>
                                    <span class="icon">
                                        <FontAwesomeIcon icon={faLongArrowAltDown} style={{ fontSize: '20px'}} />                                
                                    </span>
                                </button>
                            </p>

                        </div>
                        
                        

                    </div>
                </div>
                <div class="has-text-weight-semibold" style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Choose Train to Watch:</div>
                <div class="columns" style={{ marginTop: '0.75rem', marginBottom: '0' }}>
                    <div class="column is-6" style={{ margin: '0', padding: '0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <button class="button is-info is-outlined" style={{ width: '200px', margin: '0.1875rem' }}>5:32 am - NB 101</button>
                            <button class="button is-info is-outlined" style={{ width: '200px', margin: '0.1875rem' }}>6:06 am - NB 103</button>
                            <button class="button is-info is-outlined" style={{ width: '200px', margin: '0.1875rem' }}>7:08 am - NB 207</button>
                            <button class="button is-info is-outlined" style={{ width: '200px', margin: '0.1875rem' }}>8:08 am - NB 217</button>
                            <button class="button is-info is-outlined" style={{ width: '200px', margin: '0.1875rem' }}>8:30 am - NB 221</button>
                        </div>
                    </div>
                    <div class="column is-6" style={{ margin: '0', padding: '0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <button class="button is-info is-outlined" style={{ width: '200px', margin: '0.1875rem' }}>9:33 am - NB 231</button>
                            <button class="button is-info is-outlined" style={{ width: '200px', margin: '0.1875rem' }}>10:18 am - NB 135</button>
                            <button class="button is-info is-outlined" style={{ width: '200px', margin: '0.1875rem' }}>11:15 am - NB 139</button>
                            <button class="button is-info is-outlined" style={{ width: '200px', margin: '0.1875rem' }}>12:15 pm - NB 143</button>
                            <button class="button is-info is-outlined" style={{ width: '200px', margin: '0.1875rem' }}>1:15 pm - NB 147</button>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button class="button is-warning is-outlined" style={{ width: '200px', margin: '0.1875rem' }}>Show Later Times</button>
                </div>
                
            </div>
        </div>
    );
}

export default Dashboard;