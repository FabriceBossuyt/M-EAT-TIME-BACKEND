'use strict'

var dbConfig = require('../config/database.config.js')
var knex = require('knex')(dbConfig)

exports.up = function() {
  return knex.schema
  .createTableIfNotExists('user_recipe', function(table) {
    table.integer('user_id').unsigned().references('users.id').notNullable();
    table.integer('recipe_id').unsigned().references('recipes.id').notNullable();
  })
};

exports.down = function() {
  return knex.schema
  .dropTable('user_recipe')
};

module.exports = exports;