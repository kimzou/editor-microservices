import React from 'react';

const DisplayId = ({ token, email }) => {
	return (
	<>
		<h1>Token user : { token }</h1>
		<h1>User conected : { email }</h1>
	</>
	)
}

  export default DisplayId;