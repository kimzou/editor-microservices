const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require("@apollo/gateway");
import { graphql } from "graphql";

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'users', url: 'http://localhost:4001' },
        { name: 'mimos', url: 'http://localhost:4000/graphql' },
    ]
});

const server = new ApolloServer({
    gateway,
    subscriptions: false,
});

server.listen(4002).then(({ url }) => console.log(`Server ready at ${url}`));