const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require("@apollo/gateway");
require('dotenv').config()

const { URI_USER, URI_MIMO, LOCAL_USER, LOCAL_MIMO } = process.env;

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'users', url: URI_USER || LOCAL_USER },
        { name: 'mimos', url: URI_MIMO || LOCAL_MIMO },
    ]
});

const server = new ApolloServer({
    gateway,
    subscriptions: false,
});

server.listen(4002).then(({ url }) => console.log(`Server ready at ${url}`));