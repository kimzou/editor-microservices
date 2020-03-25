const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const { buildFederatedSchema } = require('@apollo/federation');
const express = require("express");
const { verify } = require("jsonwebtoken");
require('dotenv').config();

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs/typeDefs');
const { MONGO_USER, MONGO_PASS, MONGO_DB } = process.env;

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    context: ({ req }) => {
        try {
            const token = req.headers.authorization;
            const loginas = req.headers.loginas;
            console.log("in index user", {token, loginas})
            if (token === undefined) return null;
            const user = verify(token, process.env.JWT_SECRET);
            // if(loginas) verify(loginas, process.env.JWT_SECRET);
            console.log("user connected in user index", {user})
            return { user, loginas };
        } catch (error) {
            console.error(error)
        }
    }
});

const app = express();
server.applyMiddleware({ app });

mongoose
    .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@dnd-dtit4.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        app.listen(4001, () => {
            console.log(`Server listening on port http://localhost:4001/graphql`);
        });
    })
    .catch(e => console.error(e));
