const { ApolloServer } = require('apollo-server');
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const { errorHandling } = require("./utils/helpers");
const { verify } = require('jsonwebtoken');
require('dotenv').config()

const { URI_USER, URI_MIMO, LOCAL_USER, LOCAL_MIMO } = process.env;

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    // attach key-value to the header before calling services
    willSendRequest({ request, context }) {
        console.log('gateawy', {context})
        if(context.id) request.http.headers.set("userID", context.id);
        if(context.token) request.http.headers.set("authorization", context.token);
        if(context.loginas) request.http.headers.set("loginas", context.loginas);
    }
};

// list of all services connected to the gateway
const gateway = new ApolloGateway({
    serviceList: [
        { name: 'users', url: LOCAL_USER },
        { name: 'mimos', url: LOCAL_MIMO },
    ],
    buildService({ name, url }) {
        return new AuthenticatedDataSource({ url });
    },
});

const server = new ApolloServer({
    gateway,
    subscriptions: false,
    context: ({ req }) => {
        try {
            console.log("gateway context auto", req.headers.authorization)
            const tokenBearer = req.headers.authorization || "";
            // id of the user we want to log with
            console.log("headers login as", req.headers.loginas)
            const loginas = req.headers.loginas || "";
            console.log("login as gateway", {loginas})
            if(tokenBearer === "" || undefined) return;
            const token = tokenBearer.replace("Bearer ", "");
            const { id } = verify(token, process.env.JWT_SECRET);
            // const { id } = verify(loginAsToken === "" ? token : loginAsToken , process.env.JWT_SECRET);
            console.log("gateway", {id, token})
            return { id, token, loginas };
        } catch (error) {
            console.error(error)
        }
    },
    // custom errors send to the client
    formatError: err => errorHandling(err),
});

server.listen(4002).then(({ url }) => console.log(`Server ready at ${url}`));