'use strict'

var conn = {
  host: 'localhost',
  user: 'root',
  password: 'jezusiship',
  charset: 'utf8'
}

var Promise = require('bluebird');
var userMigration = require('./user/user.migration.js')
var roleMigration = require('./role/role.migration.js');
var userRoleMigration = require('./user_role/user_role.migration.js');
var knex = require('knex')(require('./config/database.config.js'));
var userTableMade = false;
var rolesTableMade = false;

var knex2 = require('knex')({ client: 'mysql', connection: conn });

module.exports = function initDb() {
  knex2.raw("CREATE DATABASE IF NOT EXISTS MeatTime")
    .then(function () {

      Promise.coroutine(function* () {

        yield knex.schema.hasTable('users').then(function (exists) {
          if (!exists) {
            userMigration.up().then(function () {
              console.log("User table made")
            });
          }
        })

        yield knex.schema.hasTable('roles').then(function (exists) {
          if (!exists) {
            roleMigration.up().then(function () {
              console.log("Role table made")
            });
          }
        })

        yield knex.schema.hasTable('users_roles').then(function (exists) {
          if (!exists) {
            userRoleMigration.up().then(function () {
              console.log("User_role table made")
            });
          }
        })

      })()
    })
}