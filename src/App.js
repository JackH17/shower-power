import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import './sass/app.scss';
import ShowerPower from './Containers/ShowerPower';
import PageNotFound from './Components/PageNotFound';

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" render={(props) => <ShowerPower {...props}/>}/>
          <Route component={PageNotFound}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
