const User = require("../models/userModel")
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: "128499853975-ns1ivu3v42jcs2gutlrp7vj9grchlov2.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "/auth/google/callback",
    },
        function (request, accessToken, refreshToken, profile, done) {
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