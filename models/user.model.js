'use strict'

var bookshelf = require('../config/bookshelf.config.js');
var ModelBase = require('bookshelf-modelbase')(bookshelf);
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var securityConfig = require('../config/security.config.js');
var Joi = require('joi');
var moment = require('moment');

var Role = require('../models/role.model.js');
var PasswordReset = require('../models/password_reset_token.model.js');
var Recipe = require('../models/recipe.model.js') 
var Ingredient = require('../models/ingredient.model.js')
var Meal = require('../models/meal.model.js')

module.exports = ModelBase.extend({
  tableName: 'users',
  hasTimeStamps: true,
  passwordResetToken() {
    return this.hasOne(PasswordReset, 'password_reset_token_id');
  },
  roles() {
    return this.belongsToMany(Role, 'user_role');
  },
  validPassword(password) {
    return bcrypt.compareAsync(password, this.attributes.password);
  },
  meals () {
    return this.belongsToMany(Ingredient, 'user_meal')
  },
  ingredients () {
    return this.belongsToMany(Ingredient, 'user_ingredient')
  },
  recipes () {
    return this.belongsToMany(Ingredient, 'user_recipe')
  },
  initialize() {
    this.on('saving', model => {
      if (!model.hasChanged('password')) return;

      return Promise.coroutine(function* () {
        const salt = yield bcrypt.genSaltAsync(securityConfig.saltRounds);
        const hashedPassword = yield bcrypt.hashAsync(model.attributes.password, salt);
        model.set('password', hashedPassword);
      })();
    });
  },
  validate: {
    first_name : Joi.string().min(2).max(25), 
    last_name : Joi.string().min(2).max(25), 
    //username : Joi.string().min(2).max(25), 
    email : Joi.string().email(), 
    facebook_id : Joi.string(), 
    password : Joi.string(),
    facebook_access_token: Joi.string(), 
    password_reset_token: Joi.string(), 
    password_reset_token_ttl: Joi.date(), 
    google_id : Joi.string(), 
    google_access_token : Joi.string()
  }
});