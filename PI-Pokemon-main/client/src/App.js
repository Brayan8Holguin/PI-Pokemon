import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import DetailPage from './components/DetailPage';
import FormPage from './components/FormPage';
  const App = () => {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/home" component={HomePage} />
            <Route path="/pokemon/:id" component={DetailPage} />
            <Route path="/create" component={FormPage} />

          </Switch>
        </div>
      </Router>
    );
  };
    


export default App;