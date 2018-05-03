'use strict'

var dbConfig = require('../config/database.config.js')
var knex = require('knex')(dbConfig)

exports.up = function() {
  return knex.schema
  .createTableIfNotExists('user_ingredient', function(table) {
    table.integer('user_id').unsigned().references('users.id').notNullable();
    table.integer('ingredient_id').unsigned().references('ingredients.id').notNullable();
  })
};

exports.down = function() {
  return knex.schema
  .dropTable('user_ingredient')
};

module.exports = exports;