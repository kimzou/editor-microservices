import React from 'react';
import { gql } from 'apollo-boost';
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from '@apollo/react-hooks';

import { useAuth } from '../context/authContext';

// return the id of the user associed to the email given
const LOGIN_AS = gql`
  mutation loginAs ($email: String!) {
    loginAs(email: $email) {
      token
    }
  }
`;

// const LOGIN_AS = gql`
//   {
//     mutation loginAs ($email: String!) {
//       loginAs(email: $email)
//     }
//     loginAsId @client
//   }
// `;

// const LOGIN_AS = gql`
//   {
//     loginAs @client
//   }
// `;

const SwitchUserButton = ({ email }) => {
  const { updateToken, updateEmail } = useAuth();
  const history = useHistory();
  const [loginAs] = useMutation(LOGIN_AS, {
    variables: { email: email },
    onError(err) { console.error(err) } 
  });
  // const { data, client } = useQuery(LOGIN_AS);

  
  const switchUser = async () => {
    // console.log("login as", await loginAs());
    // const { data  } = await loginAs();
    // console.log({data});
    const { data: { loginAs: { token } } } = await loginAs();
    // console.log({loginAs, token});
    // client.writeData({ data: { loginAsId: data.loginAs } });
    // updateToken(data.loginAs);
    // history.push({pathname: `/loginas/${email}`, state: { token: data.loginAs }});
    localStorage.setItem("loginas", token);
    if(token) updateEmail(email);
    // localStorage.setItem("userID", data.loginAs);
    history.replace(`/loginas/${email}`);
  }

  return (
    <>
      <button onClick={ switchUser }>
          Switch to {email}
      </button>
    </>
  )
};

export default SwitchUserButton;