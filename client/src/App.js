import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

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

const Error = props => {
  return (
    <p color="red">
      <i>Service {props.service} down</i>
    </p>
  )
}

const Users = props => {
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  console.log({ data })
  const [msgError, setMsgError] = useState("")
  // if (loading) return <p>Loading...</p>;
  if (error.message.includes("server down")) {
    console.log("err.message")
  }

  return (
    <>
      <h1>Users:</h1>
      {(data && data.allUsers)
        ? data.allUsers.map(user => <li key={user.id}>{user.title} (id {user.id})</li>)
      : <p>{msgError}</p>
      }
    </>
  )
}

const Mimos = () => {
  const { loading, error, data } = useQuery(GET_ALL_MIMOS);
  console.log({ data })

  if (loading) return <p>Loading...</p>;
  if (error) console.error(error);

  return (
    <>
      <h1>Mimos:</h1>
      {data && data.getMimos &&
        data.getMimos.map(mimo => <li key={mimo.id}>{mimo.title} (id {mimo.id})</li>)
      }
    </>
  )
}


const App = () => {
  return (
    <>
      <Users service="Utilisateur" />
      <Mimos service="MiMo" />
    </>
  )
}



export default App;
