const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const { buildFederatedSchema } = require('@apollo/federation');
const express = require('express');
const passport = require('passport');  

require('dotenv').config();

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs/typeDefs');
const { MONGO_USER, MONGO_PASS, MONGO_DB } = process.env;

const strategies = require('./passport_strategies');

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    playground: true,
    context: ({ req }) => {
        try {
            const token = req.headers.authorization;
            const loginas = req.headers.loginas;
            // console.log("in index user", {token, loginas})
            if (token === undefined) return null;
            const user = verify(token, process.env.JWT_SECRET);
            // console.log("user connected in user index", {user})
            return { user, loginas };
        } catch (error) {
            console.error(error)
        }
    }
});

const app = express();
server.applyMiddleware({ app });
app.use(passport.initialize());
app.use(passport.session());

mongoose
    .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@dnd-dtit4.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        app.listen({ port: 4001 }, () =>
            console.log(`Server ready at http://localhost:4001`)
        );
    })
    .catch(e => console.error(e));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Configure view engine to render pug templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// Routes
app.get('/',
    function(req, res) {
        res.render('home');
});

// app.get('/login',
//     function(req, res) {
//         res.render('login');
// });

// app.get('/register',
//     function(req, res) {
//         res.render('register');
// });

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        //Redirect home if successful.
        res.redirect('/');
});

app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email', 'user_gender'] }));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/auth/linkedin',
  passport.authenticate('linkedin', { state: 'SOME STATE'  }));

app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { successRedirect: '/', failureRedirect: '/login'}));

app.get('/auth/twitter',
    passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
});