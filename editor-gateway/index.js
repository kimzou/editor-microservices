const { ApolloServer } = require('apollo-server');
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const { errorHandling } = require("./utils/helpers");
const { verify } = require('jsonwebtoken');
require('dotenv').config()

const { URI_USER, URI_MIMO, LOCAL_USER, LOCAL_MIMO } = process.env;

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    willSendRequest({ request, context }) {
        console.log("send  context", { context })
        //  console.log("context lol", context.lol)
        console.log("send request context id", context.id)
        console.log("headers autho", context.token)
        request.http.headers.set("user-id", context.id);
        request.http.headers.set("authorization", context.token);
        console.log("requet", request.http.headers)
    }
};

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'users', url: LOCAL_USER },
        { name: 'mimos', url: LOCAL_MIMO },
    ],
    buildService({ name, url }) {
        console.log({name, url})
        return new AuthenticatedDataSource({ url });
    },
});

const server = new ApolloServer({
    gateway,
    subscriptions: false,
    context: ({ req }) => {
        // console.log({req})
        console.log("gateway", req.headers.authorization)
        const tokenBearer = req.headers.authorization || ""; 
        if(tokenBearer === "") return;
        const token = tokenBearer.replace("Bearer ", "");
        console.log("tooooken",{token})
        const { id } = verify(token, process.env.JWT_SECRET);
        console.log(({id, token}))
        return { id, token };
    },
    formatError: err => errorHandling(err),
});

server.listen(4002).then(({ url }) => console.log(`Server ready at ${url}`));