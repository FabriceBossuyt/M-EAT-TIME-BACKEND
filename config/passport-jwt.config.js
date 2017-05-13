'use strict';

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const securityConfig = require('./security.config.js');
var FacebookStrategy = require('passport-facebook')
const User = require('../user/user.model.js');

var options = {
    clientID: '1218309744962656',
    clientSecret: 'bed4fb629cfa8d43bc398cd4c8eb1640',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
};

module.exports = function() {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = securityConfig.jwtSecret;

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.where('id', jwt_payload.id).fetch({withRelated: 'roles'})
            .then(user => user ? done(null, user) : done(null, false))
            .catch(err => done(err, false));
    }));

    passport.use( new FacebookStrategy(options, function(accessToken, refreshToken, profile, done) {
            console.log(profile); 
            // User.findOrCreate(
            //     { facebookId: profile.id },
            //     function (err, result) {
            //         if(result) {
            //             result.access_token = accessToken;
            //             result.save(function(err, doc) {
            //                 done(err, doc);
            //             });
            //         } else {
            //             done(err, result);
            //         }
            //     }
            // );
        }
    )
);
};