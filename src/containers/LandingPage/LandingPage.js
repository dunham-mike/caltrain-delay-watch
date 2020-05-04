import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import CaltrainLandingBackground from '../../images/caltrain-landing.jpg';

const LandingPage = (props) => {    
    return (
        <React.Fragment>
            <div style={{ 
                width: '100vw', height: 'calc(100vh - 52px)', 
                backgroundImage: `url(${CaltrainLandingBackground})`,
                backgroundPosition: '50% 20%',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                zIndex: '-1',
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                backgroundBlendMode: 'darken',
             }}
            >
                <div style={{ maxWidth: '850px', width: '100%', height: '100%', margin: '0 auto', padding: '0.75rem 1.5rem',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div>
                        <div className="has-text-white is-size-3 has-text-centered has-text-weight-bold" 
                            style={{ 
                                // marginTop: '25vh',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                maxWidth: '725px' 
                            }}>
                            Your commute just became a lot more reliable
                        </div>
                        <div className="has-text-white is-size-5 has-text-centered has-text-weight-bold" 
                            style={{ 
                                marginTop: '2rem',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                maxWidth: '425px' 
                            }}
                        >
                            Get a text whenever your usual Caltrain will be more than a few minutes late.
                        </div>
                        <div style={{ marginTop: '15vh', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <RouterLink to="/create-account">
                                <button className="button is-primary has-text-weight-bold">Create an account</button>
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
                
            
        </React.Fragment>
    );
}

export default LandingPage;