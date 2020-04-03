const { gql } = require('apollo-server');

const user = gql`
    extend type Query {
        me: User!,
        user(id: ID!): User,
        users: [User]!,
        globalExam(token: String!): User,
    }

    extend type Mutation {
        register(email: String!, password: String!): AuthPayload,
        login(email: String!, password: String!): AuthPayload,
        confirmMail(emailToken: String!, email: String!): AuthPayload,
        triggerPasswordReset(email: String!): Boolean,
        passwordReset(
            email: String!
            resetToken: String!
            password: String!
        ): UserIdPayload!,
        changePassword(oldPassword: String!, newPassword: String!): UserIdPayload!
    }

    type User {
        id: ID
        firstname: String
        lastname: String
        verifiedAccount: Boolean
        email: String!
        roles: Roles
    }

    type AuthPayload {
        token: String
        user: User!
        error: String
    }

    type UserIdPayload {
        id: ID!
    }

    enum Roles {
        STUDENT
        INSTRUCTOR
        ADMIN
    }
`;

module.exports = user;