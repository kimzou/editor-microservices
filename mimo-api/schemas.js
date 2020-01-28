const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Mimo {
        id: ID!
        title: String
        description: String
    }
    
    type Query {
        getMimos: [Mimo]
    }

    type Mutation {
        addMimo(title: String!, description: String!): Mimo
    }
`;

module.exports = typeDefs;