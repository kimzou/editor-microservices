import { gql } from 'apollo-server-express';

    
const globalExam = gql`
    type User {
        id: ID!
        username: String
    }
    type Query {
        user(token: String!): User
    }
`;

export default globalExam;