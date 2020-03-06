import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useParams
} from "react-router-dom";

const GET_ALL_USERS = gql`
  query users {
    allUsers {
      id
      username
    }
  }
`;

const GET_ALL_MIMOS = gql`
  query mimos {
    getMimos {
      id
      title
    }
  }
`;

const Error = ({ service }) => {
  return (
    <p style={{ color: "red" }}>
      <i>Service {service} down</i>
    </p>
  )
}

const Users = ({ service }) => {

  const { loading, error, data } = useQuery(GET_ALL_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) {
    if (error.message.includes("Server down")) {
      return <Error service={service} />
    }
  }

  return (
    <>
      <h1>Users:</h1>
      {
        (data && data.allUsers) && 
        data.allUsers.map(user => 
          <li key={user.id}>{user.title} (id {user.id})</li>
        )
      }
    </>
  )
}

const Mimos = ({ service }) => {
  const { loading, error, data } = useQuery(GET_ALL_MIMOS);

  if (loading) return <p>Loading...</p>;
  if (error) {
    if (error.message.includes("Server down")) {
      return <Error service={service} />
    }
  }

  return (
    <>
      <h1>Mimos:</h1>
      {
        (data && data.getMimos) &&
        data.getMimos.map(mimo => 
          <li key={mimo.id}>{mimo.title} (id {mimo.id})</li>
        )
      }
    </>
  )
}

const putId = () => {
  localStorage.setItem("user", "5e00897f2419760808ec42e1")
};

const LOGIN_AS = gql`
  mutation loginAs ($email: String!) {
    loginAs(email: $email) {
      token
    }
  }
`;

const LoginAs = ({ user }) => {
  console.log({user})
  const history = useHistory();
  const [loginAs] = useMutation(LOGIN_AS, {
    variables: { email: user },
    // onCompleted({ loginAs: { token } }) { console.log("complete", token) },
    onError(err) { console.error('query', err) } 
  });
  
  const switchUser = async () => {
    const { data: { loginAs: { token } } } = await loginAs();
    console.log({token})
    localStorage.setItem("user", token);
    history.push(`/loginas/${user}`)
  }

  return (
    <>
      <button onClick={ switchUser }>
        {/* <Link to={`/loginas/${user}`}> */}
          Switch to {user}
        {/* </Link> */}
      </button>
    </>
  )
};

const DisplayId = () => {
  const [user, setUser] = useState("")
  useEffect(() => {
    setUser(localStorage.getItem("user"))
  }, [user]);
 return (
  <>
    <h1>id user : {user}</h1>
    <button onClick={putId}>
      Put my id in localStorage
    </button>
  </>
 )
}

const LogOut = () => {
  const { email } = useParams();
  const history = useHistory();

  console.log({email});
  const logOut = () => {
    console.log("LOG OUT")
    localStorage.removeItem("user");
    history.push("/");
  };
  return (
    <button onClick={logOut}>
      LogOut
    </button>
  )
}

const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/home">
            <Users service="User" />
            <Mimos service="MiMo" />
          </Route>
          <Route path="/loginas/:email">
            <LogOut />
          </Route>
          <Route exact path="/">
            <DisplayId />
            <LoginAs user="mikasa@gmail.com"/>
          </Route>
        </Switch>
      </Router>
    </>
  )
}



export default App;
