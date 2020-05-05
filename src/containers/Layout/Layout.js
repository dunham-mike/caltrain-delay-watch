import React from 'react';

import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

const Layout = (props) => {
    return (
        <React.Fragment>
            <Navbar isAuthenticated={props.isAuthenticated} />
            {props.children}
            <Footer />
        </React.Fragment>
    );
}

export default Layout;