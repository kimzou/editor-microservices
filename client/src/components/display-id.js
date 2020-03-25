import React, { useEffect, useState } from 'react';

const DisplayId = ({ token, id, email }) => {
	// const [token, setToken] = useState(props.token);
	// useEffect(() => {
	// 	setToken(localStorage.getItem("user"))
	// }, [token]);
	return (
	<>
			<h1>Token user : { token }</h1>
			<h1>User : { email }</h1>
			<h1>Login As : {  }</h1>
	</>
	)
}

  export default DisplayId;