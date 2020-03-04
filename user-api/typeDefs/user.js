const { gql } = require('apollo-server');

const user = gql`
    extend type Query {
        me: User!,
        user(id: ID!): User,
        users: [User]!,
        globalExam(token: String!): User,
        # login(email: String!, password: String!): AuthPlayload
    }
    extend type Mutation {
        register(email: String!, password: String!): AuthPlayload,
        login(email: String!, password: String!): AuthPlayload
    }
    type User {
        id: ID
        firstname: String
        lastname: String
        email: String!
        roles: Roles
    }
    type AuthPlayload {
        token: String
        error: String
    }
    enum Roles {
        STUDENT
        INSTRUCTOR
        ADMIN
    }
`;

module.exports = user;