const passport = require('passport');
const User = require('./models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const strategies =
    //  Google Passport Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env['GOOGLE_CLIENT_ID'],
        clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
        callbackURL: "/auth/google/callback",
        profileFields: ['id', 'displayName', 'email']
    },
        function(accessToken, refreshToken, profile, cb) {
            // console.log(profile);
            // console.log(accessToken);
            // console.log(refreshToken);
            User.findOne({'google.id': profile.id}, (err, user) => {
                if (err) return cb(err);
                if (!user) {
                    user = new User({
                        username : profile.displayName,
                        email: profile.emails[0].value,
                        google: {
                            id: profile.id,
                            lastName: profile.name.familyName,
                            firstName: profile.name.givenName,
                            token: refreshToken
                        }
                    });
                    user.save((err) => {
                        console.log('new user created: ' + user);
                        if (err) console.log(err);
                        return cb(err, user);
                    });
                } else {
                    console.log('user exists');
                    return cb(null, profile);
                }
            })
        }
    ));

    //  Facebook Passport Strategy
    passport.use(new FacebookStrategy({
        clientID: process.env['FACEBOOK_APP_ID'],
        clientSecret: process.env['FACEBOOK_APP_SECRET'],
        callbackURL: "/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'email']
    },
        function(accessToken, refreshToken, profile, cb) {
            User.findOne({'facebook.id': profile.id}, (err, user) => {
                if (err) return cb(err);
                if (!user) {
                    user = new User({
                        username : profile.displayName,
                        email: profile.emails[0].value,
                        facebook: {
                            id: profile.id,
                            lastName: profile.name.familyName,
                            firstName: profile.name.givenName,
                            token: accessToken
                        }
                    });
                    user.save((err) => {
                        console.log('new user created: ' + user);
                        if (err) console.log(err);
                        return cb(err, user);
                    });
                } else {
                    console.log('user exists');
                    return cb(null, profile);
                }
            })
        }
    ));

    //  LinkedIn Passport Strategy
    passport.use(new LinkedInStrategy({
        clientID: process.env['LINKEDIN_KEY'],
        clientSecret: process.env['LINKEDIN_SECRET'],
        callbackURL: "/auth/linkedin/callback",
        scope: ['r_emailaddress', 'r_liteprofile']
    },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({'linkedin.id': profile.id}, (err, user) => {
                if (err) return done(err);
                if (!user) {
                    user = new User({
                        username : profile.displayName,
                        email: profile.emails[0].value,
                        linkedin: {
                            id: profile.id,
                            lastName: profile.name.familyName,
                            firstName: profile.name.givenName,
                            token: accessToken
                        }
                    });
                    user.save((err) => {
                        console.log('new user created: ' + user);
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    console.log('user exists');
                    return done(err, profile);
                }
            })
        }
    ));

    //  Twitter Passport Strategy
    passport.use(new TwitterStrategy({
        consumerKey: process.env['TWITTER_CONSUMER_KEY'],
        consumerSecret: process.env['TWITTER_CONSUMER_SECRET'],
        callbackURL: "/auth/twitter/callback"
    },
        function(token, tokenSecret, profile, cb) {
            console.log(profile);
            console.log(token);
            User.findOrCreate({ username: profile.displayName, email: profile.emails[0].value, 'twitter.id': profile.id, token: token }, (err, user) => {
                if (user) console.log('new user created: ' + user);
                if (err) console.log(err);
                return cb(null, profile);
            });
        }
    ));

module.exports = strategies;