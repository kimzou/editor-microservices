const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
require('dotenv').config()

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs/typeDefs');
const { MONGO_USER, MONGO_PASS, MONGO_DB } = process.env;

mongoose
    .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@dnd-dtit4.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        server.listen(4001, () => {
            console.log(`Server listening on port 4001`);
        });
    })
    .catch(e => console.error(e));

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
})