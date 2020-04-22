const { ApolloServer } = require('apollo-server-express');
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const { errorHandling } = require("./utils/helpers");
const { verify } = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const bodyParser = require("body-parser");

const { URI_USER, URI_MIMO, LOCAL_USER, LOCAL_MIMO } = process.env;

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    // set headers before calling services
    willSendRequest({ request, context }) {
        // console.log('gateawy', request.http.headers)
        if(context.id) request.http.headers.set("userID", context.id);
        if(context.token) request.http.headers.set("authorization", context.token);
        if(context.loginas) request.http.headers.set("loginas", context.loginas);
    }

    // didReceiveResponse({ request, response, context }) {
    //     console.log("did recived name", this.name)
    //     // try {
    //     //     // const cookie = request.http.headers.get('Cookie');
    //     //     // if (cookie) {
    //     //     //     context.responseCookies.push(cookie);
    //     //     // }
    //     //     console.log({response})
    //     //     console.log({request})
    //     //     console.log({context})
    //     // } catch (error) {
    //     //     console.error(error)
    //     // }

    //     // Return the response back, even when unchanged.
    //     console.log({response});
    //     console.log({context});
    //     console.log({request});
    //     return { message: request }
    //     return response;
    // }
};

// list of all services connected to the gateway
const gateway = new ApolloGateway({
    serviceList: [
        { name: 'users', url: LOCAL_USER },
        { name: 'mimos', url: LOCAL_MIMO },
    ],
    buildService({ name, url }) {
        return new AuthenticatedDataSource({ name, url });
    },
    // debug: true,
});

const server = new ApolloServer({
    gateway,
    subscriptions: false,
    cors: false,
    context: ({ req, res }) => {
        try {
            console.log(res.getHeaders())
            // console.log("gateway context auto", req.headers.authorization)
            // const tokenBearer = req.headers.authorization || "";
            // console.log("headers login as", req.headers.loginas)
            // const loginas = req.headers.loginas || "";
            // console.log("login as gateway", {loginas})
            // if(tokenBearer === "" || undefined) return;
            // const token = tokenBearer.replace("Bearer ", "");
            // const { role } = verify(token, process.env.JWT_SECRET);
            // console.log("gateway", {token, role})
            // return role === "ADMIN" ? { token, loginas } : { token };
            // console.log("gateaway res.cookie", res.cookie);
            // console.log("req.headers", req.headers)
            // console.log("res.headers", res.headers)
            // console.log("req.cookie", res.cookie)
            return { res }
        } catch (error) {
            console.error(error)
        }
    },
    // custom errors send to the client
    formatError: err => errorHandling(err),
});

const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
}

const app = express();
// app.use(cors(corsOptions));
// app.use(bodyParser.json())
server.applyMiddleware({ app, cors: corsOptions });
// server.applyMiddleware({ app, cors: false });

app.listen(4002, () => console.log(`Server ready at http://localhost:4002/graphql`));