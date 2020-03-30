const { gql } = require('apollo-server-express');

const course = gql`
    type Course {
        id: ID!
        title: String
        mimos: [Mimo]
    }
    extend type Query {
        getCourses: [Course]
    }
`;

module.exports = course;