import React from 'react';
import { gql } from 'apollo-boost';
import { useHistory } from "react-router-dom";
import { useMutation } from '@apollo/react-hooks';

const LOGIN_AS = gql`
  mutation loginAs ($email: String!) {
    loginAs(email: $email) {
      token
    }
  }
`;

const SwitchUserButton = ({ user }) => {
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
            Switch to {user}
        </button>
      </>
    )
};

export default SwitchUserButton;