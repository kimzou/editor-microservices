const { ApolloServer } = require('apollo-server-express');
const { buildFederatedSchema } = require('@apollo/federation');
const express = require('express');
const { verify } = require("jsonwebtoken");
const jsforce = require("jsforce");
require('dotenv').config();
const axios = require('axios');
const typeDefs = require('./typeDefs/typeDefs');
const resolvers = require('./resolvers');

const server = new ApolloServer({ 
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    context: ({ req }) => {
        try {
            const token = req.headers.authorization;
            if (token) {
                const user = verify(token, process.env.JWT_SECRET);
                return { user };
            } else {
                throw Error("not authentificated")
            }
        } catch (error) {
            console.error(error)
        }
    }
 });

const conn = new jsforce.Connection({
    loginUrl: "https://test.salesforce.com"
});

conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    function(err, userInfo) {
        if (err) return console.error("error", err);
        console.log(userInfo);
        // console.log("access token: ", conn.accessToken);
        // console.log("instance url: ", conn.instanceUrl);
    }  
)

// const query = {
//     query: "query { Account { Name Custom_Field__c } }",
//     variables: {}
//   };
//   const headers = {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.SF_ACCESS_TOKEN}`
//     }
//   }
//   try {
//     axios
//       .post(
//         "https://ionisx--sweedtest.my.salesforce.com/services/apexrest/aptk_graphql/graphql",
//         query,
//         headers
//       )
//       .then(result => {
//         console.log("result", result.data);
//       })
//       .catch(error => {
//         console.log('error', error.response);
//       });
//   } catch (error) {
//     console.log("error", error.response);
//     reject(error);
//   }  

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4006 }, () =>
    console.log(`🚀 Server ready at http://localhost:4006${server.graphqlPath}`)
);