import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label
} from 'reactstrap';

const REGISTER_MUTATION = gql`
    mutation register($email: String!, $password: String!) {
        register(email: $email, password: $password) {
            token
            error
        }
    }
`;

const Register = props => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginUser, { loading, error, data }] = useMutation(REGISTER_MUTATION, {
        onError(error) {
            console.log('Error : ', error)
        },
        onCompleted(data) {
            if (data.login.token) {
                localStorage.setItem("token", data.register.token, { expires: data.login.tokenExpiration });
                props.history.push('/')
            } else if (data.login.error) {
                alert(data.login.error)
            }
        }
    });

    return (
        <Form onSubmit={(e) => {
            e.preventDefault();
            loginUser({
                variables: { email, password }
            });
        }}>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="exampleEmail" className="mr-sm-2">Email</Label>
                <Input value={email} onChange={e => setEmail(e.target.value)} type="email" name="email" id="exampleEmail" placeholder="something@idk.cool" required />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="examplePassword" className="mr-sm-2">Password</Label>
                <Input value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" id="examplePassword" placeholder="password" required />
            </FormGroup>
            <Button disabled={loading}>Login</Button>
        </Form>
    );
}

export default Register;