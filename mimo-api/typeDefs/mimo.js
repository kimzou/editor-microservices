const { gql } = require('apollo-server-express');

const mimo = gql`
    type Mimo {
        id: ID!
        title: String
        description: String
    }
    extend type Query {
        getMimos: [Mimo]
    }
    extend type Mutation {
        addMimo(title: String!, description: String!): Mimo
    }
`;

module.exports = mimo;