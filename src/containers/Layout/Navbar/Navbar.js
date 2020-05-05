import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = (props) => {
    return (
        <nav className="navbar is-fixed-top has-background-grey-dark">
            <div style={{ maxWidth: '850px', width: '100%', margin: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} >
                <div className="navbar-brand">
                    <RouterLink className="navbar-item has-text-primary is-size-4 has-text-weight-bold" to="/">
                        Caltrain Delay Watch
                    </RouterLink>
                    {props.isAuthenticated 
                        ?   <RouterLink className="navbar-item has-text-white is-hidden-mobile" to="/">
                                Home
                            </RouterLink>
                        :   null
                    } 
                </div>
                {props.isAuthenticated 
                    ?   <div style={{ display: 'flex', flexDirection: 'row' }}>
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
                    : <div>
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
                }
            </div>
        </nav>
    );
}

export default Navbar;