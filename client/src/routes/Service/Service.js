import React from 'react';
import UsersService from '../../components/users-service';
import MimosService from '../../components/mimos-service';

const Service = props => {
    return (
        <>
            <UsersService service="User" />
            <MimosService service="MiMo" />
        </>
    )
};

export default Service;