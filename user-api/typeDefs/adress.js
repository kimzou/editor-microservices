const { gql } = require('apollo-server-express');

const adress = gql`
    type Adress {
        id: ID!
        username: String
        roles: Roles
    }
`;

module.exports = adress;