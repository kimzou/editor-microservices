const { gql } = require('apollo-server-express');

const course = gql`
    type Course {
        id: ID!
        title: String
    }
`;

module.exports = course;