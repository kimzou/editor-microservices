const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require("@apollo/gateway");
const { errorHandling } = require("./utils/helpers");
require('dotenv').config()

const { URI_USER, URI_MIMO, LOCAL_USER, LOCAL_MIMO } = process.env;

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'users', url: LOCAL_USER },
        { name: 'mimos', url: LOCAL_MIMO },
    ]
});

const server = new ApolloServer({
    gateway,
    subscriptions: false,
    formatError: err => errorHandling(err),
});

server.listen(4002).then(({ url }) => console.log(`Server ready at ${url}`));