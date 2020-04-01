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
        console.log(req.headers.authorization)
    }
 });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);