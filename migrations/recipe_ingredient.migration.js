'use strict'

var dbConfig = require('../config/database.config.js')
var knex = require('knex')(dbConfig)

exports.up = function() {
  return knex.schema
  .createTableIfNotExists('recipe_ingredient', function(table) {
    table.integer('recipe_id').unsigned().references('recipes.id').notNullable();
    table.integer('ingredient_id').unsigned().references('ingredients.id').notNullable();
  })
};

exports.down = function() {
  return knex.schema
  .dropTable('user_role')
};

module.exports = exports;