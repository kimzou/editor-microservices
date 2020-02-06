const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
require('dotenv').config()

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs/typeDefs');
const { MONGO_USER, MONGO_PASS, MONGO_DB } = process.env;

mongoose
    .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@dnd-dtit4.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        server.listen(4001).then(({ url }) => {
            console.log(`Server listening on ${url}`);
        });
    })
    .catch(e => console.error(e))

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});
