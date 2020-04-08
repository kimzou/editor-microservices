const { ApolloServer } = require('apollo-server-express');
const { buildFederatedSchema } = require('@apollo/federation');
const express = require('express');
const { verify } = require("jsonwebtoken");
require('./config');

const typeDefs = require('./typeDefs/typeDefs');
const resolvers = require('./resolvers');

const server = new ApolloServer({ 
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    context: ({ req }) => {
        try {
            const token = req.headers.authorization;
            if (token) {
                const user = verify(token, process.env.JWT_SECRET);
                return { user };
            } else {
                throw Error("not authentificated")
            }
        } catch (error) {
            console.error(error)
        }
    }
 });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);