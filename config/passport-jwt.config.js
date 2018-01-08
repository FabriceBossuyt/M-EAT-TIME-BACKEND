'use strict';

var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var securityConfig = require('./security.config.js');
var FacebookStrategy = require('passport-facebook');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../user/user.model.js');

var facebookOptions = {
  clientID: '1218309744962656',
  clientSecret: 'bed4fb629cfa8d43bc398cd4c8eb1640',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'first_name', 'last_name', 'email'],
  enableProof: true
},
  googleOptions = {
    clientID: '197159020604-3qun995fopbno97ptcuo6ejks74te9ou.apps.googleusercontent.com',
    clientSecret: '3-NebGinoqeHgWZQL-NOo8_a',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  };

var updateFacebookUser = function (user, accessToken) {
  return user.save({ facebook_access_token: accessToken });
}

var createFacebookUser = function (user, accessToken, profile) {
  return user.save({
    facebook_access_token: accessToken, first_name: profile.name.givenName,
    last_name: profile.name.familyName,
    email: profile.emails[0].value,
    //username: profile.name.givenName + profile.name.familyName
  });
}

var createGoogleUser = function(user, accessToken, profile){
    return user.save({
    google_access_token: accessToken, first_name: profile.name.givenName,
    last_name: profile.name.familyName,
    email: profile.emails[0].value,
    //username: profile.name.givenName + profile.name.familyName
  });
}

var updateGoogleUser = function(user, accessToken){
  return user.save({google_access_token: accessToken})
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

  passport.use(new FacebookStrategy(facebookOptions, function (accessToken, refreshToken, profile, done) {
    var user = User.forge({ facebook_id: profile.id })
    user.fetch({ withRelated: 'roles' }).then(function (model) {
      if (model) {
        updateFacebookUser(user, accessToken).then(function (response) {
          return done(null, response.attributes)
        }, function (error) {
          return done(error)
        });
      }
      else {
        createFacebookUser(user, accessToken, profile).then(function (response) {
          return done(null, response.attributes)
        }, function (error) {
          return done(error)
        })
      }
    })
  }));

  passport.use(new GoogleStrategy(googleOptions, function(token , refreshToken, profile, done){
    var user = User.forge({google_id : profile.id})
    console.log(profile)
    user.fetch().then(function(model){
      if (model){
      updateGoogleUser(user, token).then(function (response) {
          return done(null, response.attributes)
        }, function (error) {
          return done(error)
        });
      }
      else {
        createGoogleUser(user, token, profile).then(function (response) {
          return done(null, response.attributes)
        }, function (error) {
          return done(error)
        })
      }
    })
  }));

};