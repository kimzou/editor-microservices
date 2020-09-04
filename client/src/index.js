import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';

// import { ApolloClient } from 'apollo-client';
// import { createHttpLink, HttpLink } from "apollo-link-http"
// import { InMemoryCache } from "apollo-cache-inmemory"
// import { setContext } from "apollo-link-context";

import { ApolloClient } from "apollo-client";
import { HttpLink, createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

// import { ApolloProvider } from "react-apollo";
// import {
//     ApolloClient,
//     InMemoryCache,
//     HttpLink,
//     ApolloLink,
//   } from 'apollo-boost';

// const cache = new InMemoryCache();
// cache.writeData({
//     data: {
//       token: localStorage.getItem('token'),
//     },
// });

// const client = new ApolloClient({
//     link: new ApolloLink((operation, forward) => {
//         const token = localStorage.getItem("token");

//         // const token = await localStorage.getItem("token");
//         console.log("client index localstorage", token)
//       operation.setContext({
//         fetchOptions: {
//           credentials: 'include'
//        },
//         // headers: {
//         //     authorization: token ? `Bearer ${token}` : "",
//         //     loginas: localStorage.getItem("loginas") || "",
//         //     // userID: localStorage.getItem("userID") || "",
//         // }
//       });
//       return forward(operation);
//     }).concat(
//       new HttpLink({
//         uri: 'http://localhost:4002/graphql',
//         credentials: 'include',
//       })
//     ),
//     cache: cache,
//     credentials: 'include'
//   });




// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link:  new HttpLink({
//       uri: 'http://localhost:4002/graphql',
//       credentials: 'include',
//     }),
//   // request: (operation) => {
//   //   operation.setContext({
//   //     headers: {
//   //       authorization: token ? `Bearer ${token}` : ''
//   //     }
//   //   })
//   // },
//   onError: ({ graphQLErrors, networkError, response, operation}) => {
//     console.log("errrorr", { graphQLErrors, response})
//     console.log("nestwork status: ", networkError.statusCode)
//   },
//   credentials: 'include',
//   fetchOptions: {
//     credentials: 'include'
//   }
// });

// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: new HttpLink({
//     uri: "http://localhost:4002/graphql",
//     credentials: "include"
//   }),
//   onError: ({ graphQLErrors, networkError, response, operation }) => {
//     console.log("errrorr", { graphQLErrors, response })
//     console.log("nestwork status: ", networkError.statusCode)
//   },
// });

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4002/graphql',
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
  onError: ({ graphQLErrors, networkError, response, operation }) => {
    console.log("errrorr", { graphQLErrors, response })
    console.log("nestwork status: ", networkError.statusCode)
  },
  request: async operation => {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_STRIPE_PUB_KEY}`
      },
      fetchOptions: {
        credentials: 'include'
      }
    })
  },
})

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
