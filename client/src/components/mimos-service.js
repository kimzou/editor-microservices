import React from 'react';
import ErrorService from './error-service';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const GET_ALL_MIMOS = gql`
  query mimos {
    getMimos {
      id
      title
    }
  }
`;

const MimosService = ({ service }) => {
    const { loading, error, data } = useQuery(GET_ALL_MIMOS);
  
    if (loading) return <p>Loading...</p>;
    if (error) {
      if (error.message.includes("Server down")) {
        return <ErrorService service={service} />
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

  export default MimosService;