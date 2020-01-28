const { gql } = require('apollo-server');

module.exports = gql`
    type Query {
        me: User,
        userId(id: ID!): User,
        allUsers: [User]!,
    }
    # type User @key(fields: "id") {
    #     id: ID!
    #     username: String
    #     roles: Roles
    # }
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