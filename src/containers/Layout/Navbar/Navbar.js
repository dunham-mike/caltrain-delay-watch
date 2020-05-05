import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = (props) => {
    const [isHamburgerActive, setIsHamburgerActive] = useState(false);

    const toggleHamburger = () => {
        setIsHamburgerActive(!isHamburgerActive);
    }

    return (
        <React.Fragment>
            {props.isAuthenticated 
            ?
                <React.Fragment>
                    <nav className="navbar is-fixed-top has-background-grey-dark is-hidden-touch" style={{ minHeight: '56px' }}></nav>
                    <nav className="navbar is-fixed-top has-background-grey-dark is-hidden-desktop" style={{ minHeight: '52px' }}></nav>
                    <nav className="navbar is-fixed-top has-background-grey-dark" role="navigation" aria-label="main navigation" 
                        style={{ maxWidth: '850px', width: '100%', margin: 'auto' }}
                    >
                        <div className="navbar-brand">
                            <RouterLink className="navbar-item has-text-primary is-size-4 has-text-weight-bold" to="/">
                                Caltrain Delay Watch
                            </RouterLink>
                            
                            <div 
                                role="button" 
                                className={"navbar-burger burger" + (isHamburgerActive ? " is-active" : "")}
                                aria-label="menu" 
                                aria-expanded="false"
                                tabIndex={0}
                                data-target="navbarBasicExample"
                                onClick={toggleHamburger}
                                onKeyDown={toggleHamburger}
                            >
                                <span aria-hidden="true" style={{ color: 'white' }}></span>
                                <span aria-hidden="true" style={{ color: 'white' }}></span>
                                <span aria-hidden="true" style={{ color: 'white' }}></span>
                            </div>
                        </div>
                        <div className={"navbar-menu has-background-grey-dark" + (isHamburgerActive ? " is-active" : "")}
                        id="navbarBasicExample" 
                            // className={"navbar-menu" + (isHamburgerActive ? " is-hidden" : "")}
                        >
                            <div className="navbar-start">
                                <div className="navbar-item">
                                    <RouterLink className="navbar-item has-text-white" to="/">
                                        Home
                                    </RouterLink>
                                </div>
                            </div>
                            <div className="navbar-end">
                                
                                <div className="navbar-item">
                                    <RouterLink className="navbar-item has-text-white" to="/settings">
                                        Settings
                                    </RouterLink>
                                </div>
                                <div className="navbar-item">
                                    <RouterLink className="navbar-item has-text-white" to="/logout">
                                        Log out
                                    </RouterLink>
                                </div>
                            </div>
                        </div>
                    </nav>
                </React.Fragment>
            : 
                <nav className="navbar is-fixed-top has-background-grey-dark" role="navigation" aria-label="main navigation">
                    <div style={{ maxWidth: '850px', width: '100%', margin: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} >
                        <div className="navbar-brand">
                            <RouterLink className="navbar-item has-text-primary is-size-4 has-text-weight-bold" to="/">
                                Caltrain Delay Watch
                            </RouterLink>
                        </div>
                        <div>
                            <div className="navbar-item">
                                <div className="buttons">
                                    <RouterLink className="button is-primary is-hidden-mobile" to="/create-account">
                                        <strong>Sign up</strong>
                                    </RouterLink>
                                    <RouterLink className="button is-light" to="/login">
                                        Log in
                                    </RouterLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            }
        </React.Fragment>
    );
}

export default Navbar;