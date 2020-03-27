const { gql } = require('apollo-server-express');

const root = gql`
    type Query {
        _: Boolean
    }
    type Mutation {
        _: Boolean
    }
`;

module.exports = root;