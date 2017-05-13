'use strict'

var dbConfig = require('../config/database.config.js')
var knex = require('knex')(dbConfig)

exports.up = function() {
  return knex.schema
  .createTableIfNotExists('roles', function(table) {
    table.increments('id').primary();
    table.string("name").unique().notNullable();
    table.string("code").unique().notNullable();
    table.timestamps();
  })
};

exports.down = function() {
  return knex.schema
  .dropTable('roles')
};

module.exports = exports;