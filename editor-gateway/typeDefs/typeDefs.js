const { gql } = require("apollo-server-express");

const user = gql`
    extend type Query {
        me: User,
    }
`;