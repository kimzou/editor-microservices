const { gql } = require('apollo-server');

const root = gql`
    type Query {
        _: Boolean
    }
    type Mutation {
        _: Boolean
    }
`;

module.exports = root;