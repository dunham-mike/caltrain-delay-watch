import React, { Suspense, useContext } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

import Dashboard from './containers/Dashboard/Dashboard';
import WatchCommute from './containers/WatchCommute/WatchCommute';
import AuthorizationForm from './containers/AuthorizationForm/AuthorizationForm';
import LandingPage from './containers/LandingPage/LandingPage';
import Logout from './containers/AuthorizationForm/Logout/Logout';

import { store } from './store/store';

const App = () => {
    const context = useContext(store);
    const { state } = context;

    let routes = (
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route path="/" exact component={LandingPage} />
                <Route path="/create-account" component={AuthorizationForm} />
                <Route path="/login" component={AuthorizationForm} />
                <Redirect to="/login" />
            </Switch>
        </Suspense>
    );

    if(state.token !== null) {
        routes = (
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path="/" exact component={Dashboard} />
                    <Route path="/watch-commute" component={WatchCommute} />
                    <Route path="/logout" component={Logout} />
                    <Redirect to="/" />
                </Switch>
            </Suspense>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <nav className="navbar is-fixed-top has-background-grey-dark">
                <div style={{ maxWidth: '850px', width: '100%', margin: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} >
                    <div className="navbar-brand">
                        <RouterLink className="navbar-item has-text-primary is-size-4 has-text-weight-bold" to="/">
                            Caltrain Delay Watch
                        </RouterLink>
                        {state.token !== null 
                            ?   <RouterLink className="navbar-item has-text-white is-hidden-mobile" to="/">
                                    Home
                                </RouterLink>
                            :   null
                        } 
                    </div>
                    {state.token !== null 
                        ?   <div class="navbar-item">
                                <RouterLink className="navbar-item has-text-white" to="/logout">
                                    Log out
                                </RouterLink>
                            </div>
                        : <div>
                            <div class="navbar-item">
                                <div class="buttons">
                                <RouterLink class="button is-primary is-hidden-mobile" to="/create-account">
                                    <strong>Sign up</strong>
                                </RouterLink>
                                <RouterLink class="button is-light" to="/login">
                                    Log in
                                </RouterLink>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </nav>
            <div style={{ flexGrow: '1' }}>
                {routes}
            </div>
            <footer className="footer has-background-grey has-text-white" style={{ paddingBottom: '3rem' }}>
                <div className="content has-text-centered">
                    <p>
                        <strong className="has-text-white">Caltrain Delay Watch</strong> by <a className="has-text-info" target="_blank" rel="noopener noreferrer" href="https://www.mikedunham.org">Mike Dunham</a>
                    </p>
                    <p style={{margin: '0.75rem auto'}}>
                        © {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;