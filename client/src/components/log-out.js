import React from 'react';
import { useHistory } from "react-router-dom";

const LogOut = props => {

    const history = useHistory();
  
    const logOut = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("loginas");
      history.push("/");
    };

    return (
      <button onClick={logOut}>
        LogOut
      </button>
    )
};

export default LogOut;