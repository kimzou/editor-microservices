import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';

// import { ApolloClient } from 'apollo-boost';
// import { createHttpLink } from "apollo-link-http"
// import { InMemoryCache } from "apollo-cache-inmemory"
import { setContext } from "apollo-link-context";

import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloLink,
  } from 'apollo-boost';

// const httpLink = new createHttpLink({ uri: "http://localhost:4002" });

// const authLink = setContext((_, { headers, ...context }) => {
//     const token = localStorage.getItem("token");
//     return {
//         headers: {
//             ...headers,
//             authorization: token && `Bearer ${token}`,
//             // authorization: token ? `Bearer ${token}` : '',
//             // userID: localStorage.getItem("userID") ? localStorage.getItem("userID") : "",
//             loginas: localStorage.getItem("loginas") ? localStorage.getItem("loginas") : "",
//             // loginas: localStorage.getItem("loginas") || "",
//         },
//         ...context,
//     }
// });

// const client = new ApolloClient({
//     link: authLink.concat(httpLink),
//     cache: new InMemoryCache(),
// })

// const client = new ApolloClient({
//     uri: 'http://localhost:4002',
//     request: async operation => {
//     const token = await localStorage.getItem.getItem('token');
//       operation.setContext({
//         headers: {
//             authorization: token ? `Bearer ${token}` : "",
//             loginas: localStorage.getItem("loginas") || "",
//         },
//       });
//     },
//   })
const cache = new InMemoryCache();
cache.writeData({
    data: {
      token: localStorage.getItem('token'),
    },
});

const client = new ApolloClient({
    link: new ApolloLink((operation, forward) => {
        const token = localStorage.getItem("token");

        // const token = await localStorage.getItem("token");
        console.log("client index localstorage", token)
      operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : "",
            loginas: localStorage.getItem("loginas") || "",
            // userID: localStorage.getItem("userID") || "",
        }
      });
      return forward(operation);
    }).concat(
      new HttpLink({
        uri: 'http://localhost:4002',
      })
    ),
    cache: cache
  });

  

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
