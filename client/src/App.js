import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery} from '@apollo/react-hooks';

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

const Users = () => {
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  console.log({data})

  if (loading) return <p>Loading...</p>;
  if (error) console.error(error);

  return (
    <>
      <h1>Users:</h1>
      {data && data.allUsers && 
        data.allUsers.map(user => <li key={user.id}>{user.title} (id {user.id})</li>)
      }
    </>
  )
}

const Mimos = () => {
  const { loading, error, data } = useQuery(GET_ALL_MIMOS);
  console.log({data})

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
      <Users />
      <Mimos />
    </>
  )
}



export default App;
