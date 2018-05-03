'use strict'

var dbConfig = require('../config/database.config.js')
var knex = require('knex')(dbConfig)

exports.up = function() {
  return knex.schema
  .createTableIfNotExists('recipes', function(table) {
    table.increments('id').primary();
    table.string("name").unique().notNullable();
    table.string("description").notNullable();
    table.string("directions").notNullable();
    table.integer("time").nullable();
    table.timestamps();
  })
};

exports.down = function() {
  return knex.schema
  .dropTable('recipes')
};

module.exports = exports;