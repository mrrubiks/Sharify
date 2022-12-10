const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const githubStrategy = require('passport-github2').Strategy;
const User = require('./models/user').User;

function passportSetup(app) {

    app.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 30//1 minute
        },
        store: MongoStore.create({
            mongoUrl: process.env.NODE_ENV === 'production' ? process.env.MONGODBATLAS_SESSION_URL
                : 'mongodb://127.0.0.1:27017/sessionDB',
            autoRemove: 'interval',
            autoRemoveInterval: 10 //10 minute
        })
    }));
    // Initialize passport and passport session
    app.use(passport.initialize());
    app.use(passport.session());


    // Set serialize and deserialize user
    // This is used to store the user in the session

    // Serialize user to the session
    // req.session.passport.user = user.id
    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user.id);
        });
    });

    // The User.serializeUser() will serialize the username field to the session
    // It's not ideal to seraialize the username
    // It's better to serialize the id, because the id is unique and indexed
    //passport.serializeUser(User.serializeUser());

    // Deserialize user from the session
    // req.user = {username: 'xxx', provider: 'xxx', ...}
    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            User.findById(user, function (err, user) {
                return cb(err, user);
            });
        });
    });

    // The User.deserializeUser() will retrieve the whole user object from the database and attach it to the request object as req.user
    //passport.deserializeUser(User.deserializeUser());

    // Set up passport-local strategy
    // Use .createStrategy() instead of .authenticate()
    passport.use(User.createStrategy());
    // Set up passport-google-oauth20 strategy
    passport.use(new googleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.BACKEND_URL + process.env.GOOGLE_CALLBACK_URL
    },
        function verify(accessToken, refreshToken, profile, cb) {
            User.findOne({
                'google.id': profile.id
            }, function (err, user) {
                if (err) {
                    return cb(err);
                }
                //No user was found... 
                if (!user) {
                    console.log("No user found, creating new user");
                    user = new User({
                        username: profile.displayName,
                        provider: 'google',
                        email: profile.emails[0].value,
                        photo: profile.photos[0].value,
                        //now in the future searching on User.findOne({'google.id': profile.id } will match because of this next line
                        google: profile
                    });
                    user.save(function (err) {
                        if (err) console.log(err);
                        return cb(null, user);
                    });
                } else {
                    console.log("User found, logging in");
                    //found user. Return
                    return cb(null, user);
                }
            });
        }
    ));

    // Set up passport-github2 strategy
    passport.use(new githubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.BACKEND_URL + process.env.GITHUB_CALLBACK_URL
    },
        function verify(accessToken, refreshToken, profile, cb) {
            User.findOne({
                'github.id': profile.id
            }, function (err, user) {
                if (err) {
                    return cb(err);
                }
                if (!user) {
                    console.log("No user found, creating new user");
                    user = new User({
                        username: profile.displayName,
                        provider: 'github',
                        email: profile.emails[0].value,
                        photo: profile.photos[0].value,
                        github: profile
                    });
                    user.save(function (err) {
                        if (err) console.log(err);
                        return cb(null, user);
                    });
                } else {
                    console.log("User found, logging in");
                    return cb(null, user);
                }
            });
        }
    ));
}

module.exports = passportSetup;