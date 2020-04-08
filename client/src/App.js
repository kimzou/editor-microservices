import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
 
import { AuthContext } from "./context/authContext";
import { Service } from "./routes/Service"
import { Home } from "./routes/Home"
import { NoMatch } from "./routes/NoMatch";
import { LoginAs } from "./routes/LoginAs";
import { Register } from "./routes/Register";
import { Login } from "./routes/Login";
import { Course } from "./routes/Course";
import Success from "./routes/Course/Success"
import Mimo from "./routes/Mimo/Mimo"

const App = () => {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState("");

  const updateToken = data => setToken(data ? localStorage.setItem("token", data) : null);
  // const updateID = data => setID(localStorage.getItem("userID"), data);
  const updateEmail = data => setEmail(data);
console.log({email})
  useEffect(() => {
    console.log("use effect local", localStorage.getItem("token"))
    console.log("use effect token", token)
    setToken(localStorage.getItem("token"));
    // setID(localStorage.getItem("userID"));
  }, [token]);
  console.log("app token", token)


//TODO: parse url
  return (
    <>
      <AuthContext.Provider value={{ token, email, updateToken: updateToken, updateEmail: updateEmail }}>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/service" render={props => <Service {...props} />} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route path="/loginas/:email" component={Home} />
            <Route exact path="/course" component={Course} />
            <Route path="/mimo/:id" component={Mimo} />
            <Route path="/course/success/:session_id" component={Success} />
            <Route component={NoMatch} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </>
  )
}

export default App;