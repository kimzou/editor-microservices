import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

const LoginAs = ({ match }) => {
    console.log(match.url);
    return"lol";
};

export default LoginAs;