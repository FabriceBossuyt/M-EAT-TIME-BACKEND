'use strict'

var dbConfig = require('../config/database.config.js')
var knex = require('knex')(dbConfig)

exports.up = function() {
  return knex.schema
  .createTableIfNotExists('ingredients', function(table) {
    table.increments('id').primary();
    table.string("name").unique().notNullable();
    table.decimal("calories").nullable();
    table.timestamps();
  })
};

exports.down = function() {
  return knex.schema
  .dropTable('ingredients')
};

module.exports = exports;