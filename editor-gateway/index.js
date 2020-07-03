const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway } = require("@apollo/gateway");

const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const { ContextObject } = require("./config/contextObject");
const { URL_AUTH_SERVICE, URL_EDITOR_SERVICE, PORT } = require("./config/env");

const app = express();

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000"
    })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(compression());

const gateway = new ApolloGateway({
  serviceList: [
    { name: "auth", url: URL_AUTH_SERVICE }
    // { name: "lms", url: URL_EDITOR_SERVICE }
  ],
  buildService({ name, url }) {
    return new ContextObject({ name, url });
  },
  // Experimental: Enabling this enables the query plan view in Playground.
  __exposeQueryPlanExperimental: false,
  formatError: error => new Error(`Internal server error: ${error}`) // TODO Handle Errors
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  context: async ({ req, res }) => {
    // console.log("context", req.headers);
    // console.log("context cookies", req.headers.cookie["menu-state"]); //undefined
    // console.log("context cookies", req.cookies["x-token"]); // OK
    // console.log("context cookies", req.headers.cookie); //all cookies

    // console.log("+++++req headers in context ", req.headers);

    // console.log("req.headers['authorization']", res.cookies["authorization"]); // undefined
    // console.log("req.headers['x-token']", ["x-token"]);
    // const accessToken =
    //   req.headers["x-token"] || req.headers["authorization"] || "";
        const accessToken =
          req.cookies["x-token"] || "";
    // const accessToken = (await req.headers["authorization"]) || "";
    console.log("context access token", {accessToken})
    return { accessToken, res };
  },
  formatError: err => new Error(`Internal server error: ${err}`) // TODO Handle Errors
});

server.applyMiddleware({ app, path: "/graphql", cors: false });

app.listen(PORT, () => {
    console.log(`Gateway successfully started on port ${PORT}`);
});