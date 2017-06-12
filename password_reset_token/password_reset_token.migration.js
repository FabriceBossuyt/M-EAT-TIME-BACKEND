'use strict'

var dbConfig = require('../config/database.config.js')
var knex = require('knex')(dbConfig)

exports.up = function() {
  return knex.schema
  .createTableIfNotExists('password_reset_token', function(table) {
    table.increments('id').primary();
    table.string('token').notNullable();
    table.dateTime('ttl').notNullable();
    table.integer('user_id').unsigned().references('users.id').notNullable();
    table.timestamps();
  })
};

exports.down = function() {
  return knex.schema
  .dropTable('password_reset_token')
};

module.exports = exports;