import React, { useEffect } from 'react';
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

const GET_ACTUAL_USER = gql`
  query getUser {
    user(token:"5e2ff50c85a67dba3c9c0518") {
      id
      email
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

// const globalExamFunc = () => {
//   const token = localStorage.getItem("user");
//   const { loading, error, data } = useQuery(GET_ACTUAL_USER);

//   if (loading) return <p>Loading...</p>;
//   if (error) {
//     if (error.message.includes("Server down")) {
//       return <Error service={service} />
//     }
//   }

//   console.log({data})
// }

const App = () => {
  useEffect(() => {
    localStorage.setItem("user", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTJmZjUwYzg1YTY3ZGJhM2M5YzA1MTgiLCJ1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.JlxUDrtq3ioiJ-sna2WyhF5ZBoLm1cMgYhp8HU6H2-c")
  }, [])
  return (
    <>
      <Users service="User" />
      <Mimos service="MiMo" />
      {/* <button onClick={globalExamFunc}>
        Gobal Exam
      </button> */}
      <a href={`http://localhost:4002?query={user(token:"5e2ff50c85a67dba3c9c0518"){username}}`}>Global Exam</a>
    </>
  )
}



export default App;
