import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import DisplayId from '../../components/display-id';
import SwitchUserButton from '../../components/switch-user-button';
import LogOut from '../../components/log-out';
import { AuthContext, useAuth } from '../../context/authContext';

const ACTUAL_USER = gql`
	query me {
		me {
			email
		}
	}
`;


const Home = props => {
	// console.log("props", props.token)
	const { token, email } = useContext(AuthContext);
	console.log("home email", email)
	const { updateEmail } = useAuth();
	const history = useHistory();
	console.log("home use token", token);
			
	const { _, __, data, refetch } = useQuery(ACTUAL_USER, {
		onError(error) {
			console.log('Error : ', error)
		},
		onCompleted(data) {
			console.log("on complete", {data})
			updateEmail(data.me.email);
		}
	});
	// useEffect(() => {
	// 	refetchUser();
	// });

	const refetchUser = () => refetch();
	// console.log({data})

	// const historyToken = history.location.state ? history.location.state.token : null;
	// console.log({historyToken})
	// const homeHandle = () => {
	// 	refetch();
	// 	// props.token();
	// 	history.push("/");
	// }

	return(
		<>
			{/* {data && data.me && <h4>{data.me.email}</h4>} */}
			<DisplayId token={token} email={email} />
			{/* <DisplayId token={token} id={ID} email={data && data.me && data.me.email} /> */}
			{/* <DisplayId token={historyToken ? historyToken : props.token} /> */}
			<hr />
			<SwitchUserButton email="mikasa@gmail.com" />
			<SwitchUserButton email="armin@gmail.com" />
			<hr />
			<button onClick={() => history.push("/login")} >Login</button>
			<hr />
			<button onClick={() => history.push("/register")} >Register</button>
			<hr />
			<LogOut />
			<hr />
			<button onClick={() => history.push("/")}>Home</button>
		</>
	);
};

export default Home;