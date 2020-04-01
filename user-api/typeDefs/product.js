const { gql } = require('apollo-server-express');

const product = gql`
    type Product {
        id: ID!
        mimoId: String
        price: Int
    }
`;

module.exports = product;