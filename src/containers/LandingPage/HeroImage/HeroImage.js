import React from 'react';

import CaltrainLandingBackground from '../../../images/caltrain-landing.jpg';

const BackgroundImage = (props) => {
    return(
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
            {props.children}
        </div>
    );
}

export default BackgroundImage;