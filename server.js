var init = require('./db-init.js');
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var configurePassport = require('./config/passport-jwt.config.js');
var authController = require('./auth/authentication.controller.js');

var app = express();

init();

app.use(passport.initialize());
configurePassport();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', authController);

app.listen(3000, function(){
  console.log('Listening on port 3000'); 

});

