import React, { Suspense, useContext, useEffect } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import jwt from 'jwt-decode';

import Layout from './containers/Layout/Layout';
import Dashboard from './containers/Dashboard/Dashboard';
import WatchCommute from './containers/WatchCommute/WatchCommute';
import Authorization from './containers/Authorization/Authorization';
import LandingPage from './containers/LandingPage/LandingPage';
import Settings from './containers/Settings/Settings';
import Logout from './containers/Authorization/Logout/Logout';
import ErrorBoundary from './containers/ErrorBoundary/ErrorBoundary';
import ForcedLogout from './components/ForcedLogout/ForcedLogout';

import { store } from './store/store';

const App = () => {
    const context = useContext(store);
    const { dispatch, state } = context;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            const decodedToken = jwt(token);
            if(decodedToken.exp > (Date.now()/1000)) {
                const user = decodedToken.email;
                dispatch({ type: 'LOG_IN_USER', user: user, token: token });
            } else {
                dispatch({ type: 'LOG_OUT_USER' });
            }
        } 
    }, [dispatch]);

    let routes = (
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route path="/" exact component={LandingPage} />
                <Route path="/create-account" component={Authorization} />
                <Route path="/login" component={Authorization} />
                <Redirect to="/" />
            </Switch>
        </Suspense>
    );

    if(state.token !== null) {
        routes = (
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path="/" exact component={Dashboard} />
                    <Route path="/watch-commute" component={WatchCommute} />
                    <Route path="/settings" component={Settings} />
                    <Route path="/logout" component={Logout} />
                    <Redirect to="/" />
                </Switch>
            </Suspense>
        );
    }

    return (
        <ErrorBoundary>
            {state.error !== null ? <ForcedLogout /> : null}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 52px)' }}>
                <Layout isAuthenticated={state.token !== null}>
                    <div style={{ flexGrow: '1' }}>
                        {routes}
                    </div>
                </Layout>
            </div>
        </ErrorBoundary>
    );
}

export default App;