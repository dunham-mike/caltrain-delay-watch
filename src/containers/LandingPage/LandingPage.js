import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import CaltrainLandingBackground from '../../images/caltrain-landing.jpg';

const LandingPage = (props) => {    
    return (
        <React.Fragment>
            <div style={{ 
                width: '100vw', height: '100vh', 
                backgroundImage: `url(${CaltrainLandingBackground})`,
                backgroundPosition: '50% 20%',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                zIndex: '-1',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backgroundBlendMode: 'darken',
             }}
            >
                <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '0.75rem 1.5rem' }}>
                    <div className="has-text-white is-size-3 has-text-centered has-text-weight-bold" 
                        style={{ 
                            marginTop: '6rem',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            maxWidth: '700px' 
                        }}>
                        Get a text or email whenever your Caltrain is more than a few minutes late
                    </div>
                    <div className="has-text-white is-size-5 has-text-centered has-text-weight-bold" 
                        style={{ 
                            marginTop: '1.5rem',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            maxWidth: '375px' 
                        }}
                    >
                        Sleep in, get a few more things done at the office, or just catch a different train.
                    </div>
                    <div style={{ marginTop: '6rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <RouterLink to="/create-account">
                            <button className="button is-primary has-text-weight-bold">Create an account</button>
                        </RouterLink>
                    </div>
                </div>
            </div>
                
            
        </React.Fragment>
    );
}

export default LandingPage;