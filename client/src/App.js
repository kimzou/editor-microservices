import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Service from './Service';

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
    console.log({error})
    if (error.message.includes("server down")) {
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
    console.log({error})
    if (error.message.includes("server down")) {
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


const App = () => {
  return (
    <>
      <Users service="User" />
      {/* <Service name="Users" result="allUsers" query={GET_ALL_USERS} /> */}
      <Mimos service="MiMo" />
    </>
  )
}



export default App;
