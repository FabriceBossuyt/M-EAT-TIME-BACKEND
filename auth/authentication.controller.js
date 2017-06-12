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
  const { username, password } = req.body;
  Promise.coroutine(function* () {
    const user = yield User.where('username', username).fetch();
    const isValidPassword = yield user.validPassword(password);
    if (isValidPassword) {
      const token = jwt.encode(user.omit('password'), securityConfig.jwtSecret);
      res.json({ success: true, token: `JWT ${token}` });
    } else {
      res.json({ success: false, msg: 'Authentication failed' });
    }
  })().catch(err => console.log(err));
});

router.post('/register', (req, res) => {
  const { username, password, email, first_name, last_name } = req.body;
  User.forge({ username, password, email, first_name, last_name }, { hasTimeStamps: true }).save()
    .then(user => res.json(user.omit('password')));
});

router.get('/facebook',
  passport.authenticate('facebook', { session: false, scope: ['email'] }), function (req, res) { }
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: "/" }),
  function (req, res) {
    var user = User.forge(req.user);
    var token = jwt.encode(user.omit('password'), securityConfig.jwtSecret);
    res.json({ success: true, token: `JWT ${token}` });
  }
);

router.post('/password-reset', function (req, res) {
  var email = req.body.email;
  var user = User.forge({ email: email });

  user.fetch().then(function (model) {
    if (model && !model.attributes.facebook_id) {
      var token = Math.floor(10000000 + Math.random() * 90000000).toString();
      console.log(token)
      ResetToken.forge({token: token, ttl: new Date(moment().add(1, 'hours')), user_id: model.attributes.id }, {hasTimeStamps: true}).save().then(function (resetToken) {
        console.log(resetToken)
        model.save({ password_reset_token_id: resetToken.attributes.id });
        sendMail(resetToken)
        res.json({ success: true, msg: 'Succccc' })
      })
    }
    else
      res.json({ success: false, msg: 'No such user' })
  })
});

router.post('/password-change', function (req, res) {
  var token = req.body.token;
  var password = req.body.password;
  var email = req.body.email;

  Promise.coroutine(function* () {
    var user = yield User.where('email', email).fetch({withRelated: ['password_reset_token']});
    var isExpired = yield user.resetToken().ttl < moment();
    var isValidToken = yield user.resetToken().isValidToken(token);

    if (isExpired)
      res.json({ success: false, msg: 'Token expired' });

    if (isValidToken) {
      user.save({password: password});
      res.json({success: true, msg: 'Password Updated'})
    } else {
      res.json({ success: false, msg: 'Invalid Code' });
    }
  })().catch(err => console.log(err));
})

function sendMail(user) {
  //implement mail sending api
  var mailContent = 'token  + text'
  var mailTo = user.email;
}

module.exports = router;