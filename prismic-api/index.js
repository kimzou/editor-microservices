const express           = require('express');
const app               = express();
const port              = 8080;
const Prismic           = require('prismic-javascript');
const PrismicDOM        = require('prismic-dom');
const apiEndpoint       = "https://ix-portal.cdn.prismic.io/api/v2";
const linkResolver      = require('./prismic-configuration.js');
require('dotenv').config()

// Middleware to inject prismic context
app.use((req, res, next) => {
    res.locals.ctx = {
      endpoint: apiEndpoint,
      linkResolver: linkResolver,
    };
    // add PrismicDOM in locals to access them in templates.
    res.locals.PrismicDOM = PrismicDOM;
    next();
});

// Initialize prismic.io api
const initApi = (req) => {
    return Prismic.getApi(apiEndpoint, {
      accessToken: process.env.PRISMIC_TOKEN,
      req: req
    });
}

// Query Homepage
app.get('/', (req, res) => {
    initApi(req).then(function(api) {
      api.query(
        Prismic.Predicates.at('document.type', 'formation-metier')
      ).then(function(response) {
        // response is the response object. Render your views here.
        res.send({ document: response.results[0] });
        //console.log(response.results[1]);
      });
    });
});

app.listen({ port }, () =>
console.log(`Server ready at http://localhost:8080`)
);

// app.get('/', async (req, res) => {
//     res.send([
//         {
//           "_id": "5e563ff25a838cef38393054",
//           "index": 0,
//           "guid": "3b0f2838-df1a-420c-b6a7-ad7550c93921",
//           "isActive": false,
//           "balance": "$2,196.51",
//           "picture": "http://placehold.it/32x32",
//           "age": 35,
//           "eyeColor": "blue",
//           "name": "Tamera Santos",
//           "gender": "female",
//           "company": "GUSHKOOL",
//           "email": "tamerasantos@gushkool.com",
//           "phone": "+1 (909) 430-3315",
//           "address": "934 Ruby Street, Crayne, Maine, 8703",
//           "about": "Consectetur et ipsum in elit ipsum laborum eu aliqua aliquip nisi deserunt exercitation qui sint. Quis anim duis irure Lorem occaecat nulla aute. Reprehenderit proident fugiat consequat culpa fugiat duis commodo nostrud excepteur. Proident est sit laboris adipisicing do irure velit. Amet minim adipisicing ad sit elit ut minim reprehenderit fugiat pariatur commodo incididunt ut. Culpa nostrud consequat cillum aute ipsum commodo.\r\n",
//           "registered": "2016-06-03T12:52:20 -02:00",
//           "latitude": -19.134834,
//           "longitude": 12.332219,
//           "tags": [
//             "sint",
//             "cupidatat",
//             "culpa",
//             "eiusmod",
//             "anim",
//             "officia",
//             "culpa"
//           ],
//           "friends": [
//             {
//               "id": 0,
//               "name": "Antonia Rich"
//             },
//             {
//               "id": 1,
//               "name": "Jeanie Morrow"
//             },
//             {
//               "id": 2,
//               "name": "Merle Koch"
//             }
//           ],
//           "greeting": "Hello, Tamera Santos! You have 5 unread messages.",
//           "favoriteFruit": "strawberry"
//         },
//         {
//           "_id": "5e563ff2b4f879aaabfa9663",
//           "index": 1,
//           "guid": "56275fd8-6612-462c-a729-86a632eadc3b",
//           "isActive": false,
//           "balance": "$1,092.97",
//           "picture": "http://placehold.it/32x32",
//           "age": 31,
//           "eyeColor": "brown",
//           "name": "Bridgette Oconnor",
//           "gender": "female",
//           "company": "ORBEAN",
//           "email": "bridgetteoconnor@orbean.com",
//           "phone": "+1 (809) 540-3640",
//           "address": "564 Sullivan Place, Oasis, Idaho, 597",
//           "about": "Labore Lorem sunt consectetur exercitation eiusmod ipsum. Minim esse consequat ea est mollit deserunt est dolor quis ex exercitation. Qui velit veniam magna qui enim sint. Dolore aliqua dolore mollit cillum consequat enim do nulla sunt ex culpa consectetur dolor consectetur. Deserunt duis ex esse nisi occaecat magna id esse. Dolore reprehenderit laborum pariatur mollit nulla.\r\n",
//           "registered": "2016-09-27T12:20:46 -02:00",
//           "latitude": -64.140762,
//           "longitude": 13.247213,
//           "tags": [
//             "non",
//             "fugiat",
//             "enim",
//             "duis",
//             "anim",
//             "veniam",
//             "minim"
//           ],
//           "friends": [
//             {
//               "id": 0,
//               "name": "Baird Swanson"
//             },
//             {
//               "id": 1,
//               "name": "Lewis Roberson"
//             },
//             {
//               "id": 2,
//               "name": "Gay Rodgers"
//             }
//           ],
//           "greeting": "Hello, Bridgette Oconnor! You have 10 unread messages.",
//           "favoriteFruit": "apple"
//         },
//         {
//           "_id": "5e563ff2a7c947cd20dc3b79",
//           "index": 2,
//           "guid": "7cf5ff71-8bce-479f-9fc3-cd888e2dcf13",
//           "isActive": false,
//           "balance": "$2,332.90",
//           "picture": "http://placehold.it/32x32",
//           "age": 26,
//           "eyeColor": "green",
//           "name": "Yates Gonzales",
//           "gender": "male",
//           "company": "IMANT",
//           "email": "yatesgonzales@imant.com",
//           "phone": "+1 (930) 453-3401",
//           "address": "521 Leonora Court, Alden, Connecticut, 8319",
//           "about": "Minim ipsum magna anim aute ex id enim eu adipisicing ex ad. Consectetur occaecat dolore sit tempor esse sint quis dolore. Proident ex nisi aliquip laboris consectetur reprehenderit nulla reprehenderit est ex consectetur minim deserunt enim. Qui aute ipsum adipisicing id proident dolore nisi et amet duis aliqua.\r\n",
//           "registered": "2017-04-23T09:15:46 -02:00",
//           "latitude": -86.236186,
//           "longitude": -171.068566,
//           "tags": [
//             "id",
//             "incididunt",
//             "do",
//             "laborum",
//             "esse",
//             "culpa",
//             "ex"
//           ],
//           "friends": [
//             {
//               "id": 0,
//               "name": "Brown Green"
//             },
//             {
//               "id": 1,
//               "name": "Deena Hayes"
//             },
//             {
//               "id": 2,
//               "name": "Rivers Sargent"
//             }
//           ],
//           "greeting": "Hello, Yates Gonzales! You have 4 unread messages.",
//           "favoriteFruit": "strawberry"
//         },
//         {
//           "_id": "5e563ff20988d862feeffb5f",
//           "index": 3,
//           "guid": "050b0efa-73f5-4b4c-8ae2-245f713e1382",
//           "isActive": false,
//           "balance": "$1,968.14",
//           "picture": "http://placehold.it/32x32",
//           "age": 39,
//           "eyeColor": "green",
//           "name": "Collier Curtis",
//           "gender": "male",
//           "company": "LINGOAGE",
//           "email": "colliercurtis@lingoage.com",
//           "phone": "+1 (811) 509-3116",
//           "address": "583 Cobek Court, Allensworth, Utah, 9452",
//           "about": "In sit officia sit adipisicing exercitation Lorem fugiat. Irure aliqua nulla ipsum ex nisi. Et occaecat commodo pariatur elit duis. Fugiat ut laboris in eiusmod pariatur pariatur. Occaecat eiusmod culpa consectetur nostrud incididunt veniam dolore nulla ad. Id ipsum est occaecat id nulla.\r\n",
//           "registered": "2019-01-03T11:49:37 -01:00",
//           "latitude": 65.162073,
//           "longitude": -106.581064,
//           "tags": [
//             "ea",
//             "anim",
//             "magna",
//             "aute",
//             "mollit",
//             "elit",
//             "esse"
//           ],
//           "friends": [
//             {
//               "id": 0,
//               "name": "Ida Noel"
//             },
//             {
//               "id": 1,
//               "name": "Francis Mccoy"
//             },
//             {
//               "id": 2,
//               "name": "Hinton Gillespie"
//             }
//           ],
//           "greeting": "Hello, Collier Curtis! You have 2 unread messages.",
//           "favoriteFruit": "strawberry"
//         },
//         {
//           "_id": "5e563ff260e3277ef633b5a5",
//           "index": 4,
//           "guid": "648b5eb2-f6a4-4ef0-8959-d92d8ffcb751",
//           "isActive": false,
//           "balance": "$1,464.38",
//           "picture": "http://placehold.it/32x32",
//           "age": 22,
//           "eyeColor": "blue",
//           "name": "Marisa Pena",
//           "gender": "female",
//           "company": "ZIDOX",
//           "email": "marisapena@zidox.com",
//           "phone": "+1 (956) 568-3667",
//           "address": "219 Fulton Street, Kipp, Oregon, 7050",
//           "about": "Sunt veniam non labore fugiat. Est sit dolore do deserunt nulla in commodo non fugiat ullamco velit nisi aliqua commodo. Culpa ex fugiat anim officia duis excepteur sit velit fugiat anim eiusmod. Ad est esse qui laboris mollit. Culpa sit pariatur amet adipisicing et.\r\n",
//           "registered": "2017-10-15T01:20:13 -02:00",
//           "latitude": -23.790773,
//           "longitude": -26.786785,
//           "tags": [
//             "reprehenderit",
//             "consectetur",
//             "anim",
//             "deserunt",
//             "occaecat",
//             "anim",
//             "et"
//           ],
//           "friends": [
//             {
//               "id": 0,
//               "name": "Kelli Houston"
//             },
//             {
//               "id": 1,
//               "name": "Lorraine Wise"
//             },
//             {
//               "id": 2,
//               "name": "Diana Byers"
//             }
//           ],
//           "greeting": "Hello, Marisa Pena! You have 4 unread messages.",
//           "favoriteFruit": "banana"
//         }
//       ])
// })