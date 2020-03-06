import React, { useEffect, useState } from 'react';

const DisplayId = props => {
	const [token, setToken] = useState(props.token);
	// useEffect(() => {
	// 	setToken(localStorage.getItem("user"))
	// }, [token]);
	return (
	<>
			<h1>Token user : {token}</h1>
			<button onClick={() => setToken(localStorage.setItem("user", "5e00897f2419760808ec42e1"))}>
					Put token
			</button>
	</>
	)
}

  export default DisplayId;