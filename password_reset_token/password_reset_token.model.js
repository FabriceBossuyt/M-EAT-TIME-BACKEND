'use strict';

const bookshelf = require('../config/bookshelf.config.js');
const User = require('../user/user.model.js');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var securityConfig = require('../config/security.config.js');
var moment = require('moment');

module.exports = bookshelf.Model.extend({
  tableName: 'password_reset_token',
  hasTimeStamps: true,
  user() {
    return this.belongsTo(User);
  },
  validToken(token) {
    return bcrypt.compareAsync(token, this.attributes.token);
  },
  tokenAlive(){
    return new Date(moment()) < this.attributes.ttl;
  },
  initialize() {
    this.on('saving', model => {
      if (!model.hasChanged('token')) return;

      return Promise.coroutine(function* () {
        const salt = yield bcrypt.genSaltAsync(securityConfig.saltRounds);
        const hashedToken = yield bcrypt.hashAsync(model.attributes.token, salt);
        model.set('token', hashedToken);
      })();
    });
  }
});