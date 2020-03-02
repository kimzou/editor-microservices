// const mongoose = require('mongoose');
import { ApolloServer } from 'apollo-server-express';
import { buildFederatedSchema } from'@apollo/federation';
import cors from "cors";
import {} from "dotenv/config";
import express from "express";

import GlobalExamAPI from "./dataSources/globalExamAPI";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs/globalExam";

const app = express();

// const corsOptions = {
//     origin: "http://localhost:4004"
// };

const server = new ApolloServer({
    // schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    typeDefs,
    resolvers,
    dataSources: () => {
        return { globalExamAPI: new GlobalExamAPI() }
    }
});

// app.use(cors(corsOptions));

server.applyMiddleware({ app, cors: false });

app.listen(4005, () => console.log(`🚀 Server ready at http://localhost:4005${server.graphqlPath}`))

