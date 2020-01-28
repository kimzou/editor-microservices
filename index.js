const { ApolloServer } = require('apollo-server-express');
const express = require('express');
require('./config');

const typeDefs = require('./schemas');
const resolvers = require('./resolvers');

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);