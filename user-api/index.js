const { ApolloServer } = require("apollo-server-express");
const { buildFederatedSchema } = require("@apollo/federation");
const mongoose = require("mongoose");
const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs/typeDefs");
const {
  MONGO_USER,
  MONGO_PASS,
  MONGO_DB,
  JWT_SECRET,
  JWT_REFRESH_SECRET
} = process.env;

const User = require("./models/user");
const logginMiddleware = require("./middleware/logginMiddleware");

const app = express();
// app.use(cors(corsOptions))
//TODO: remouve cookie parser
app.use(cookieParser([JWT_SECRET, JWT_REFRESH_SECRET]));
app.use(async (req, res, next) => {
  try {
    const accessToken = req.headers["x-token"];
    console.log("middleware", { accessToken });

    if (!accessToken) throw new Error("No access token");
    console.log("after if");
    const verifyToken = jwt.verify(accessToken, JWT_SECRET);
    const user = await User.findById(verifyToken.id);
    console.log("user from middleware", user);
    if (!user) throw new Error("No user found!");

    req.currentUser = user;
    next();
  } catch (error) {
    const refreshToken = req.headers["x-refresh-token"];
    console.error("LogginMiddleware error", error);
    if (error.name && error.name === "TokenExpiredError") {
      //TODO: refresh token
      console.log("middelware if expired");

    }
    if (refreshToken) {
      console.log("if refresh")
      const verifyRefreshToken = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      //TODO: set new tokens but can't in service
      // how can we get to the context service to refresh the tokens
    }
    next();
  }
});

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  playground: true,
  cors: false,
  context: async ({ req, res }) => {
    // console.log("index context request user", req.user, {user})
    // console.log("context req headers",req.headers)
    // console.log(
    //   "req.headers['authorization']",
    //   req.headers["authorization"]
    //   // ); // undefined
    //   console.log("req.headers['x-token']", req.headers["x-token"]); //null
    console.log("req.user", req.currentUser);
    // console.log("req.headers", req.headers);

    //TODO: if req has current user || if not
    // const accessToken = req.headers["x-token"];
    // const refreshToken = req.headers["x-refresh-token"];
    // let user;
    // console.log("index context", { accessToken, refreshToken });
    // if (accessToken === undefined || refreshToken === undefined) return { res };
    // console.log("if");
    // try {
    //   const decodeAccessToken = jwt.decode(accessToken, JWT_SECRET);
    //   console.log({ decodeAccessToken });
    //   console.log("id", decodeAccessToken.id);

    //   user = await User.findById(decodeAccessToken.id);

    //   console.log("index user", { user });
    //   // req.user = user;
    //   // console.log("context req.user", req.user);
    //   if (!user) return new Error("User not found");
    //   return { user };
    // } catch (error) {
    //   console.error(error);
    // }
    const user = req.currentUser;
    return { user }; // can be undefined
  }
});

const corsOptions = {
  credentials: true,
  origin: "http://localhost:3000"
};

server.applyMiddleware({ app, cors: corsOptions });

mongoose
  .connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@dnd-dtit4.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      app.listen(4001, () => {
        console.log(`Server listening on port http://localhost:4001/graphql`);
      });
    }
  )
  .catch(e => console.error(e));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//  Google Passport Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/auth/google/callback",
      profileFields: ["id", "displayName", "email"]
    },
    function(accessToken, refreshToken, profile, cb) {
      // console.log(profile);
      // console.log(accessToken);
      // console.log(refreshToken);
      User.findOne({ "google.id": profile.id }, (err, user) => {
        if (err) return cb(err);
        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            google: {
              id: profile.id,
              lastName: profile.name.familyName,
              firstName: profile.name.givenName,
              token: refreshToken
            }
          });
          user.save(err => {
            console.log("new user created: " + user);
            if (err) console.log(err);
            return cb(err, user);
          });
        } else {
          console.log("user exists");
          return cb(null, profile);
        }
      });
      // User.findOrCreate({ username: profile.displayName, email: profile.emails[0].value, socials: profile.id }, (err, user) => {
      //     if (user) console.log('new user created: ' + user);
      //     if (err) console.log(err);
      //     return cb(null, profile);
      // });
    }
  )
);

//  Facebook Passport Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env["FACEBOOK_APP_ID"],
      clientSecret: process.env["FACEBOOK_APP_SECRET"],
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"]
    },
    function(accessToken, refreshToken, profile, cb) {
      // console.log(profile);
      // console.log(profile._json);
      // console.log(accessToken);
      // console.log(refreshToken);
      User.findOne({ "facebook.id": profile.id }, (err, user) => {
        if (err) return cb(err);
        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            facebook: {
              id: profile.id,
              lastName: profile.name.familyName,
              firstName: profile.name.givenName,
              token: accessToken
            }
          });
          user.save(err => {
            console.log("new user created: " + user);
            if (err) console.log(err);
            return cb(err, user);
          });
        } else {
          console.log("user exists");
          return cb(null, profile);
        }
      });
      // User.findOrCreate({ username: profile.displayName, email: profile.emails[0].value, facebookID: profile.id }, (err, user) => {
      //     if (user) console.log('new user created: ' + user);
      //     if (err) console.log(err);
      //     return cb(null, profile);
      // });
    }
  )
);

//  LinkedIn Passport Strategy
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env["LINKEDIN_KEY"],
      clientSecret: process.env["LINKEDIN_SECRET"],
      callbackURL: "/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile"]
    },
    function(accessToken, refreshToken, profile, done) {
      // console.log(profile);
      // console.log(accessToken);
      // console.log(refreshToken);
      User.findOne({ "linkedin.id": profile.id }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            linkedin: {
              id: profile.id,
              lastName: profile.name.familyName,
              firstName: profile.name.givenName,
              token: accessToken
            }
          });
          user.save(err => {
            console.log("new user created: " + user);
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          console.log("user exists");
          return done(err, profile);
        }
      });
      // User.findOrCreate({ username: profile.displayName, email: profile.emails[0].value }, (err, user) => {
      //     if (user) console.log('new user created: ' + user);
      //     if (err) console.log(err);
      //     return done(err, user);
      // });
    }
  )
);

//  Twitter Passport Strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env["TWITTER_CONSUMER_KEY"],
      consumerSecret: process.env["TWITTER_CONSUMER_SECRET"],
      callbackURL: "/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, cb) {
      console.log(profile);
      console.log(token);
      User.findOrCreate(
        {
          username: profile.displayName,
          email: profile.emails[0].value,
          "twitter.id": profile.id,
          token: token
        },
        (err, user) => {
          if (user) console.log("new user created: " + user);
          if (err) console.log(err);
          return cb(null, profile);
        }
      );
    }
  )
);

// Configure view engine to render pug templates.
app.set("views", __dirname + "/views");
app.set("view engine", "pug");

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    //Redirect home if successful.
    res.redirect("/");
  }
);

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email", "user_gender"] })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

app.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", { state: "SOME STATE" })
);

app.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

app.get("/auth/twitter", passport.authenticate("twitter"));

app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
