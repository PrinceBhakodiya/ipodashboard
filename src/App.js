import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Login from './component/Login';
import Home from './component/Home';

function App() {
    const isAuthenticated = false; // Replace with your authentication logic

    return (
        <Router>
            <Switch>
                <Route path="/login">
                    {isAuthenticated ? <Redirect to="/home" /> : <Login />}
                </Route>
                <Route path="/home">
                    {isAuthenticated ? <Home /> : <Redirect to="/login" />}
                </Route>
                <Redirect from="/" to="/login" />
            </Switch>
        </Router>
    );
}

export default App; 