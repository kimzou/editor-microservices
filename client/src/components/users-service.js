import React from 'react';
import ErrorService from './error-service';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const GET_ALL_USERS = gql`
query users {
  users {
    id
    email
  }
}
`;

const UsersService = ({ service }) => {

    const { loading, error, data } = useQuery(GET_ALL_USERS);
  
    if (loading) return <p>Loading...</p>;
    if (error) {
      if (error.message.includes("Server down")) {
        return <ErrorService service={service} />
      }
    }
  
    return (
      <>
        <h1>Users:</h1>
        {
          (data && data.users) && 
          data.users.map(user => 
            <li key={user.id}>{user.email} (id {user.id})</li>
          )
        }
      </>
    )
  }

  export default UsersService;