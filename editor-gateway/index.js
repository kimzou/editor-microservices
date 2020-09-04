const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway } = require("@apollo/gateway");

const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const { ContextObject } = require("./config/contextObject");
const {
  URL_AUTH_SERVICE,
  URL_EDITOR_SERVICE,
  PORT,
  SECRET,
  REFRESH_SECRET
} = require("./config/env");

const app = express();

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000"
    })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser([
  SECRET,
  REFRESH_SECRET
]));

app.use(compression());

const gateway = new ApolloGateway({
  serviceList: [
    { name: "auth", url: URL_AUTH_SERVICE },
    { name: "mimo", url:  "http://localhost:4000/graphql"}
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
    // const accessToken =
    //   req.headers["x-token"] || req.headers["authorization"] || "";
    const accessToken = req.signedCookies["x-token"] || "";
    const refreshToken = req.signedCookies["x-refresh-token"] || "";
    // const accessToken = (await req.headers["authorization"]) || "";
    console.log("context access token", {accessToken, refreshToken});
    // if (!!accessToken || !!refreshToken) return { res };
    return {
      res,
      accessToken,
      refreshToken,
    };
  },
  formatError: err => new Error(`Internal server error: ${err}`) // TODO Handle Errors
});

server.applyMiddleware({ app, path: "/graphql", cors: false });

app.listen(PORT, () => {
    console.log(`Gateway successfully started on port ${PORT}`);
});