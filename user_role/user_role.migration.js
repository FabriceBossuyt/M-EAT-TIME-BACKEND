'use strict'

var dbConfig = require('../config/database.config.js')
var knex = require('knex')(dbConfig)

exports.up = function() {
  return knex.schema
  .createTableIfNotExists('users_roles', function(table) {
    table.integer('user_id').unsigned().references('users.id').notNullable();
    table.integer('role_id').unsigned().references('roles.id').notNullable();
  })
};

exports.down = function() {
  return knex.schema
  .dropTable('user_role')
};

module.exports = exports;