const { gql } = require('apollo-server-express');

const user = gql`
    extend type Query {
        me: User
        userById(id: ID!): User
        users: [User]!
        globalExam(token: String!): User
    }
    extend type Mutation {
        register(email: String!, password: String!): AuthPlayload
        login(email: String!, password: String!): AuthPlayload
        loginAs(email: String!): AuthPlayload!
    }
    type User {
        id: ID!
        firstname: String
        lastname: String
        email: String
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