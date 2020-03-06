import React from 'react';
import DisplayId from '../../components/display-id';
import SwitchUserButton from '../../components/switch-user-button';

const Home = props => {

 return(
	 <>
		{/* <LogUser token />  */}
		<DisplayId token={() => localStorage.getItem("user")} />
		<SwitchUserButton user="mikasa@gmail.com"/>
	</>
 );
};

export default Home;