import React from 'react';
import { Service } from "./routes/Service"
import { Home } from "./routes/Home"
import { NoMatch } from "./routes/NoMatch";
import { LoginAs } from "./routes/LoginAs";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route exact path="/home" component={Home} />
          <Route exact path="/service" component={Service} />
          <Route path="/loginas/:email" component={Home} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    </>
  )
}

export default App;
