'use strict'

var dbConfig = require('../config/database.config.js')
var knex = require('knex')(dbConfig)

exports.up = function() {
  return knex.schema
  .createTableIfNotExists('meals', function(table) {
    table.increments('id').primary();
    table.timestamps();
  })
};

exports.down = function() {
  return knex.schema
  .dropTable('meals')
};

module.exports = exports;