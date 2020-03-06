import React from 'react';
import { useHistory } from "react-router-dom";

const LogOut = props => {

    const history = useHistory();
  
    const logOut = () => {
      localStorage.removeItem("user");
      history.push("/");
    };

    return (
      <button onClick={logOut}>
        LogOut
      </button>
    )
};

export default LogOut;