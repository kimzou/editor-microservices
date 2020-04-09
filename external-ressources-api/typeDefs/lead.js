const { gql } = require('apollo-server-express');

const lead = gql`
    type Lead {
        id: ID!
    }
    extend type Mutation {
        createLead(fistname: String!, lastname: String!): Lead!
    }
`;

module.exports = lead;