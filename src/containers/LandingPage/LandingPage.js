import React from 'react';

import HeroImage from './HeroImage/HeroImage';
import HeroContent from './HeroContent/HeroContent';

const LandingPage = (props) => {    
    return (
        <HeroImage>
            <HeroContent />
        </HeroImage>
    );
}

export default LandingPage;