'use strict';

var express = require('express');
var jwt = require('jwt-simple');
var Promise = require('bluebird');
var User = require('../user/user.model.js');
var securityConfig = require('../config/security.config.js');
var passport = require('passport')
var crypto  = require('crypto')

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
  passport.authenticate('facebook', { session: false, scope: ['email'] }), function (req, res) {}
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: "/" }),
  function (req, res) {
    var user = User.forge(req.user);
    var token = jwt.encode(user.omit('password'), securityConfig.jwtSecret);
    res.json({ success: true, token: `JWT ${token}` });
  }
);

router.post('/reset-password', function (req, res) {
  var user = User.forge({password_reset_token: token});
  user.fetch().then (function(model){
    if (moment() > model.password_reset_token_ttl)
      res.json({success : false, msg : 'Token timed out'});
    else 
      res.json({success: true, msg: ''});
  })
});

router.post('/password-reset', function (req, res) {
  var email = req.body.email;
  var user = User.forge({ email: email });

  user.fetch().then(function (model) {
    if (model && !model.facebook_id) {
      var token = crypto.randomBytes(8).toString();
      console.log(token)
      user.save({ password_reset_token: token, password_reset_token_ttl: moment().add(1, 'hours')}).then(function(response){
        sendMail(response.attributes)
      })
    }
    else
      res.json({ success: false, msg: 'No such user' })
  })
});

router.post('/password-change', function(req, res){
  var password = req.body.password; 

})

function sendMail(user){
  //implement mail sending api
  var mailContent = 'token  + text'
  var mailTo = user.email;
}

module.exports = router;