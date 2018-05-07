'use strict'

var dbConfig = require('../config/database.config.js')
var knex = require('knex')(dbConfig)

exports.up = function() {
  return knex.schema
  .createTableIfNotExists('meal_recipe', function(table) {
    table.integer('meal_id').unsigned().references('meals.id').notNullable();
    table.integer('recipe_id').unsigned().references('recipes.id').notNullable();
    table.integer('quantity').notNullable();
  })
};

exports.down = function() {
  return knex.schema
  .dropTable('meal_recipe')
};

module.exports = exports;