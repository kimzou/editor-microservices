const { gql } = require('apollo-server-express');

const adress = gql`
    type Adress {
        id: ID!
        username: String
        role: Role
    }
`;

module.exports = adress;