'use strict'

var dbConfig = require('../config/database.config.js')
var knex = require('knex')(dbConfig)

exports.up = function() {
  return knex.schema
  .createTableIfNotExists('user_meal', function(table) {
    table.integer('user_id').unsigned().references('users.id').notNullable();
    table.integer('meal_id').unsigned().references('meals.id').notNullable();
  })
};

exports.down = function() {
  return knex.schema
  .dropTable('user_meal')
};

module.exports = exports;