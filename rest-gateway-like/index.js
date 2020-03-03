import { ApolloServer } from 'apollo-server-express';
import { buildFederatedSchema } from'@apollo/federation';
import {} from "dotenv/config";
import express from "express";

import GlobalExamAPI from "./dataSources/globalExamAPI";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs/globalExam";

const app = express();

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    // typeDefs,
    // resolvers,
    dataSources: () => {
        return { globalExamAPI: new GlobalExamAPI() }
    }
});

server.applyMiddleware({ app, cors: false });

app.listen(4005, () => console.log(`🚀 Server ready at http://localhost:4005${server.graphqlPath}`))

