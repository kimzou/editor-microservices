import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useApolloClient } from "@apollo/react-hooks";

import { useAuth } from '../context/authContext';

const LOGIN_AS = gql`
  mutation loginAs ($email: String!) {
    loginAs(email: $email) {
      token
    }
  }
`;

const IS_ADMIN = gql`
  query IsAdmin {
    isAdmin @client
  }
`;



const SwitchUserButton = ({ email }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { updateToken, updateEmail } = useAuth();
  const client = useApolloClient();
  // const { data } = useQuery(IS_ADMIN, {
  //   onCompleted(data) {
  //     console.log("is admin data", data);
  //     setIsAdmin(data.isAdmin);
  //   },
  //   onError(err) { console.error("admin", err)}
  // });

  // const { data } = useQuery(IS_ADMIN);
  // console.log("is admi n", {data})
  // data.isAdmin ? setIsAdmin(true) : setIsAdmin(false)

  
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
    const data = await client.readQuery({
      query: gql`
        query IsAdmin {
          isAdmin @client
        },
      `
    });
    console.log("read query", {data})
    if(!isAdmin) { 
      alert("Vous devez être admin");
      return;
    }
    const { data: { loginAs: { token } } } = await loginAs();
    // console.log({loginAs, token});
    // client.writeData({ data: { loginAsId: data.loginAs } });
    // updateToken(data.loginAs);
    // history.push({pathname: `/loginas/${email}`, state: { token: data.loginAs }});
    // if(token === null) return alert("Vous devez être admin");
    localStorage.setItem("loginas", token);
    updateEmail(email);
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