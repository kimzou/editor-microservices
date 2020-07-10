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
    register(email: String!, password: String!): AuthPlayload
    login(email: String!, password: String!): AuthPlayload
    # login(email: String!, password: String!): Boolean!
    loginAs(email: String!): AuthPlayload
    checkoutSession(
      userId: String
      email: String
      name: String!
      description: String
      amount: Int!
      successUrl: String!
      cancelUrl: String!
    ): String
  }
  type User {
    _id: ID
    firstname: String
    lastname: String
    email: String
    role: Role
    products: [Product]
    stripeId: String
  }
  type AuthPlayload {
    token: String
    refreshToken: String
    error: String
  }
  enum Role {
    STUDENT
    INSTRUCTOR
    ADMIN
  }
`;

module.exports = user;