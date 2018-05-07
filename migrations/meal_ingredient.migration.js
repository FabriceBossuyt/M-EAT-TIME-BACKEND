'use strict'

var dbConfig = require('../config/database.config.js')
var knex = require('knex')(dbConfig)

exports.up = function() {
  return knex.schema
  .createTableIfNotExists('meal_ingredient', function(table) {
    table.integer('meal_id').unsigned().references('meals.id').notNullable();
    table.integer('ingredient_id').unsigned().references('ingredients.id').notNullable();
    table.integer('quantity').notNullable();
  })
};

exports.down = function() {
  return knex.schema
  .dropTable('meal_ingredient')
};

module.exports = exports;