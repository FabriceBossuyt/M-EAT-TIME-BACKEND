'use strict';

var express = require('express');
var jwt = require('jwt-simple');
var Promise = require('bluebird');
var User = require('../user/user.model.js');
var ResetToken = require('../password_reset_token/password_reset_token.model.js')
var securityConfig = require('../config/security.config.js');
var passport = require('passport')
var crypto = require('crypto')
var moment = require('moment');

const router = express.Router();

router.post('/login', (req, res) => {
  console.log('Attempting to log in ')
  console.log(req.body);

  var email = req.body.email;
  var password = req.body.password
  Promise.coroutine(function* () {
    const user = yield User.where('email', email).fetch();
    const isValidPassword = yield user.validPassword(password);
    if (isValidPassword) {
      const token = jwt.encode(user.omit('password'), securityConfig.jwtSecret);
      res.status(200).send({ token: `JWT ${token}` });
    } else {
      console.log("SOMETIN WONG")
      console.log("INValid password")
      res.status(500).send();
    }
  })().catch(err => console.log(err));
});

router.post('/register', (req, res) => {
  console.log('Creating user from ');
  console.log(req.body)

  var password = req.body.password
  var email = req.body.email
  var first_name = req.body.first_name
  var last_name = req.body.last_name

  User.forge({password, email, first_name, last_name }, { hasTimeStamps: true }).save()
    .then(user => {
      console.log('Creating user')
      res.status(200).send(user.omit('password'))})
    .catch(error =>{
      res.status(500).send({ msg: error })
      console.log(error)
    }
    );
});

router.get('/facebook',
  passport.authenticate('facebook', { session: false, scope: ['email'] }), function (req, res) { }
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: "/" }),
  function (req, res) {
    var user = User.forge(req.user);
    var token = jwt.encode(user.omit('password'), securityConfig.jwtSecret);
    res.status(200).send({token: `JWT ${token}` });
  }
);

router.get('/google',
  passport.authenticate('google', { session: false, scope: ['profile', 'email']}), function (req, res) { }
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: "/" }),
  function (req, res) {
    var user = User.forge(req.user);
    var token = jwt.encode(user.omit('password'), securityConfig.jwtSecret);
    res.status(200).send({token: `JWT ${token}` });
  }
);

router.post('/password-reset', function (req, res) {
  console.log('Password reset requested')
  var email = req.body.email;
  var user = User.forge({ email: email });

  user.fetch().then(function (model) {
    if (model && (!model.attributes.facebook_id || !model.attributes.google_id)) {
      var token = Math.floor(10000000 + Math.random() * 90000000).toString();
      model.passwordResetToke().create({ token: token, ttl: new Date(moment().add(1, 'hours')), user_id: model.attributes.id }, { hasTimeStamps: true }).save().then(function (resetToken) {

        sendMail(resetToken)
        res.status(200).send({msg: 'Succccc' })
      })
    }
    else{
      res.status(404).send({msg: 'No such user' })
    }
  })
});

router.post('/password-change', function (req, res) {
  var token = req.body.token;
  var password = req.body.password;
  var email = req.body.email;

  Promise.coroutine(function* () {
    var user = yield User.where('email', email).fetch({ withRelated: ['password_reset_token'] });
    var isExpired = yield user.resetToken().ttl < moment();
    var isValidToken = yield user.resetToken().isValidToken(token);

    if (isExpired)
      res.status(500).send({msg: 'Token expired' });

    if (isValidToken) {
      user.save({ password: password });
      res.status(200).send({msg: 'Password Updated' })
    } else {
      res.status(500).send({msg: 'Invalid Code' });
    }
  })().catch(err => console.log(err));
})

function sendMail(user) {
  //implement mail sending api
  var mailContent = 'token  + text'
  var mailTo = user.email;
  console.log("mailto")
}

module.exports = router;