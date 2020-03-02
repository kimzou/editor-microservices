import { gql } from 'apollo-server-express';

    
const globalExam = gql`
    type User {
        id: ID!
        email: String
    }
    type Query {
        user(token: String!): User
    }
`;

export default globalExam;