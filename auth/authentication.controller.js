'use strict';

var express = require('express');
var jwt = require('jwt-simple');
var Promise = require('bluebird');
var User = require('../user/user.model.js');
var securityConfig = require('../config/security.config.js');
var FacebookStrategy = require('passport-facebook')

const router = express.Router();

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    Promise.coroutine(function* () {
        const user = yield User.where('username', username).fetch();
        const isValidPassword = yield user.validPassword(password);
        if (isValidPassword) {
            const token = jwt.encode(user.omit('password'), securityConfig.jwtSecret);
            res.json({success: true, token: `JWT ${token}`});
        } else {
            res.json({success: false, msg: 'Authentication failed'});
        }
    })().catch(err => console.log(err));
});

router.post('/register', (req, res) => {
    const {username, password, email} = req.body;
    User.forge({username, password, email}, {hasTimeStamps: true}).save()
        .then(user => res.json(user.omit('password')));
});





module.exports = router;