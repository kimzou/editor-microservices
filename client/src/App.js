import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import { AuthContext } from "./context/authContext";
import { Service } from "./routes/Service"
import { Home } from "./routes/Home"
import { NoMatch } from "./routes/NoMatch";
import { LoginAs } from "./routes/LoginAs";
import { Register } from "./routes/Register";
import { Login } from "./routes/Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const ACTUAL_USER = gql`
	query me {
		me {
			email
		}
	}
`;

const App = () => {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [ID, setID] = useState(localStorage.getItem("userID"));
  const [email, setEmail] = useState("");

  const updateToken = data => setToken(localStorage.setItem("token", data));
  const updateID = data => setID(localStorage.getItem("userID"), data);
  const updateEmail = data => setEmail(data);

  useEffect(() => {
    console.log("use effect")
    setToken(localStorage.getItem("token"));
    setID(localStorage.getItem("userID"));
  }, [token, ID, email, updateID, updateToken, updateEmail]);
  console.log("app token", token)



  return (
    <>
      <AuthContext.Provider value={{ token, ID, email, updateToken: updateToken, updateID: updateID, updateEmail }}>
        <Router>
          <Switch>
            <Route exact path="/" component={props => <Home {...props} email={email} />} />
            <Route exact path="/home" render={props => <Home {...props} email={email} />} />
            <Route exact path="/service" render={props => <Service {...props} />} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route path="/loginas/:email" component={props => <Home {...props} email={email} />} />
            <Route component={NoMatch} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </>
  )
}

export default App;
