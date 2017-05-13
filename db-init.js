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

var knex = require('knex')({ client: 'mysql', connection: conn });

module.exports = function initDb() {
  knex.raw("CREATE DATABASE IF NOT EXISTS MeatTime")
    .then(function () {
      knex.destroy();

      if (!knex.schema.hasTable('users')) {
        userMigration.up().then(function () {
          console.log("User table made")
          userTableMade = true;
          makeUserRoles();
        });
      }

      if (!knex.schema.hasTable('roles')) {
        roleMigration.up().then(function () {
          console.log("Role table made")
          rolesTableMade = true;
          makeUserRoles();
        });
      }
    })
};

function makeUserRoles() {
  if (userTableMade && rolesTableMade && !knex.schema.hasTable('users_roles')) {
    userRoleMigration.up().then(function () {
      console.log("User_role table made")
    });
  }
}