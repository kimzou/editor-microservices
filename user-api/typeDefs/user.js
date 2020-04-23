const { gql } = require('apollo-server-express');

const user = gql`
    extend type Query {
        me: User
        userById(id: ID!): User
        users: [User]
        globalExam(token: String!): User
        buyMimo(sessionId: String!): String
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
        loginAs(email: String!): AuthPlayload
        checkoutSession(userId: String, email: String, name: String!, description: String, amount: Int!, successUrl: String!, cancelUrl: String!): String
    }

    type User {
        id: ID!
        firstname: String
        lastname: String
        email: String!
        verifiedAccount: Boolean
        role: Role
        products: [Product]
        stripeId: String 
    }

    type AuthPayload {
        token: String
        user: User!
        error: String
    }
    type UserIdPayload {
        id: ID!
    }
    enum Role {
        STUDENT
        INSTRUCTOR
        ADMIN
    }
`;

module.exports = user;