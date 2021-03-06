'use strict'

var dbConfig = require('../config/database.config.js')
var knex = require('knex')(dbConfig)

exports.up = function () {
  return knex.schema
    .createTableIfNotExists('users', function (table) {
      table.increments('id').primary();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      //table.string('username').unique().notNullable();
      table.string('password');
      table.string('email').unique().notNullable();
      table.string('facebook_id').unique();
      table.string('facebook_access_token');
      table.string('google_id').unique();
      table.string('google_access_token');
      table.integer('password_reset_token_id').unsigned().references('password_reset_token.id');
      table.timestamps();
    })
};

exports.down = function () {
  return knex.schema
    .dropTable('users')
};

module.exports = exports;