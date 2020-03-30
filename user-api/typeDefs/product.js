const { gql } = require('apollo-server-express');

const product = gql`
    type Product {
        id: ID!
        name: String
        type: String
    }
`;

module.exports = product;