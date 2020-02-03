const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require("@apollo/gateway");
require('dotenv').config()

const { URI_USER, URI_MIMO } = process.env;
console.log({ URI_MIMO, URI_USER})
const gateway = new ApolloGateway({
    serviceList: [
        { name: 'users', url: URI_USER },
        { name: 'mimos', url: URI_MIMO },
    ]
});
// console.log({gateway})
const server = new ApolloServer({
    gateway,
    subscriptions: false,
});
// console.log({server})
server.listen(4002).then(({ url }) => console.log(`Server ready at ${url}`));