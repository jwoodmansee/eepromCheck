import React, {Component} from 'react';
import {BrowserRouter, IndexRoute, Route, Switch} from 'react-router-dom';

import Application from './containers/Application';
import Home from './Components/Home';
import DisplayFailures from './Components/DisplayFailures';
import NoMatch from './Components/NoMatch';


const Routes = () => (
        <Switch>
            <Route exact path='/' component={Application} />
            <Route path='/failures/:modelBom' component={DisplayFailures} />
            <Route path='*' component={NoMatch}/>
        </Switch>
)

export default Routes;

