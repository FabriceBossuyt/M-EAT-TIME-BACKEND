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
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'first_name', 'last_name', 'email'],
  enableProof: true
};

var updateUser = function (user, accessToken) {
  return user.save({ facebook_access_token: accessToken });
}

var createUser = function (user, accessToken, profile) {
  return user.save({
    facebook_access_token: accessToken, first_name: profile.name.givenName,
    last_name: profile.name.familyName,
    email: profile.emails[0].value,
    username: profile.name.givenName + profile.name.familyName
  });
}

module.exports = function () {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = securityConfig.jwtSecret;

  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.where('id', jwt_payload.id).fetch({ withRelated: 'roles' })
      .then(user => user ? done(null, user) : done(null, false))
      .catch(err => done(err, false));
  }));

  passport.use(new FacebookStrategy(options, function (accessToken, refreshToken, profile, done) {
    var user = User.forge({ facebook_id: profile.id })
    user.fetch().then(function (model) {
      if (model) {
        updateUser(user, accessToken).then(function (response) {
          return done(null, response.attributes)
        }, function (error) {
          return done(error)
        });
      }
      else {
        createUser(user, accessToken, profile).then(function (response) {
          return done(null, response.attributes)
        }, function(error){
          return done(error)
        })
      }
    })
  }));

};