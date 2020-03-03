const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require("@apollo/gateway");
const { errorHandling } = require("./utils/helpers");
require('dotenv').config()

const { URI_USER, URI_MIMO, LOCAL_USER, LOCAL_MIMO, LOCAL_REST_GATEWAY } = process.env;

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'users', url: URI_USER || LOCAL_USER },
        { name: 'mimos', url: URI_MIMO || LOCAL_MIMO },
        { name: 'rest-gateway', url: LOCAL_REST_GATEWAY }
    ]
});

const server = new ApolloServer({
    gateway,
    subscriptions: false,
    formatError: err => errorHandling(err),
});

server.listen(4002).then(({ url }) => console.log(`Server ready at ${url}`));