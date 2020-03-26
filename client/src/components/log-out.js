import React from 'react';
import { useHistory } from "react-router-dom";

import { useAuth } from '../context/authContext';

const LogOut = props => {

  const history = useHistory();
	const { updateToken, updateEmail } = useAuth();
  
  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginas");
    updateToken("")
    updateEmail("");
    history.push("/");
  };

  return (
    <button onClick={logOut}>
      LogOut
    </button>
  )
};

export default LogOut;