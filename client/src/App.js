import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery} from '@apollo/react-hooks';

const GET_ALL_USERS_AND_MIMOS = gql`
  query {
    allUsers {
      id
      username
    }
    getMimos {
      id
      title
    }
  }
`;

const App = () => {
  const { loading, error, data } = useQuery(GET_ALL_USERS_AND_MIMOS);
  if (loading) return <p>Loading...</p>;
  if (error) console.error(error);
  
  return (
    <>
      <h1>Users:</h1>
      {data.allUsers && 
        data.allUsers.map(user => <li key={user.id}>{user.username} (id {user.id})</li>)
      }
      <h1>Mimos:</h1>
      {data.getMimos && 
        data.getMimos.map(mimo => <li key={mimo.id}>{mimo.title} (id {mimo.id})</li>)
      }
    </>
  )
}

export default App;