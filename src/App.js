import React, { Suspense } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

import Dashboard from './containers/Dashboard/Dashboard';
import WatchCommute from './containers/WatchCommute/WatchCommute';

function App() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <nav class="navbar is-fixed-top has-background-grey-dark">
                <div class="navbar-brand" style={{maxWidth: '850px', width: '100%', margin: 'auto'}}>
                    <RouterLink class="navbar-item has-text-primary is-size-4 has-text-weight-bold" to="/">
                        Caltrain Delay Watch
                    </RouterLink>
                    <RouterLink class="navbar-item has-text-white" to="/">
                        Home
                    </RouterLink>
                </div>
            </nav>
            <div style={{ flexGrow: '1' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route path="/" exact component={Dashboard} />
                        <Route path="/watch-commute" component={WatchCommute} />
                        <Redirect to="/" />
                    </Switch>
                </Suspense>
            </div>
            <footer class="footer has-background-grey has-text-white" style={{ paddingBottom: '3rem' }}>
                <div class="content has-text-centered">
                    <p>
                        <strong class="has-text-white">Caltrain Delay Watch</strong> by <a class="has-text-info" target="_blank" rel="noopener noreferrer" href="https://www.mikedunham.org">Mike Dunham</a>
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