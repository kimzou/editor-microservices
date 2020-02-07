const { gql } = require('apollo-server');

const user = gql`
    extend type Query {
        me: User,
        userId(id: ID!): User,
        allUsers: [User]!,
    }
    type User {
        id: ID!
        username: String
        roles: Roles
    }
    enum Roles {
        STUDENT
        INSTRUCTOR
        ADMIN
    }
`;

module.exports = user;