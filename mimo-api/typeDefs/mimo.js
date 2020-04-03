const { gql } = require('apollo-server-express');

const mimo = gql`
    type Mimo {
        id: ID!
        title: String
        description: String
        price: Int
    }
    extend type Query {
        getMimos: [Mimo]
        getMimo(id: ID!): Mimo!
    }
    extend type Mutation {
        addMimo(title: String!, description: String!): Mimo
    }
`;

module.exports = mimo;