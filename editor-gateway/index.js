const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'users', url: 'http://localhost:4001' },
        { name: 'mimos', url: 'http://localhost:4000' },
    ]
});

const server = new ApolloServer({
    gateway,
    subscriptions: false,
});

server.listen(4002).then(({ url }) => console.log(`Server ready at ${url}`));