import React, { Suspense, useContext } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Layout from './containers/Layout/Layout';
import Dashboard from './containers/Dashboard/Dashboard';
import WatchCommute from './containers/WatchCommute/WatchCommute';
import AuthorizationForm from './containers/AuthorizationForm/AuthorizationForm';
import LandingPage from './containers/LandingPage/LandingPage';
import Settings from './containers/Settings/Settings';
import Logout from './containers/AuthorizationForm/Logout/Logout';
import ErrorBoundary from './containers/ErrorBoundary/ErrorBoundary';
import ForcedLogout from './components/ForcedLogout/ForcedLogout';

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