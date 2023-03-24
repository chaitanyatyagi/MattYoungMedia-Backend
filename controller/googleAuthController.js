const User = require("../models/userModel")
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: "920437538704-bjj242hn9jif5qi30tdv8nidh1j3gppi.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "/auth/google/callback",
    },
        function (request, accessToken, refreshToken, profile, done) {
            console.log("profile", profile, 2)
            return done(null, profile);
        },
    ))
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}