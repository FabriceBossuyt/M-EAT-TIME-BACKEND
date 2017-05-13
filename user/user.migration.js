'use strict'

var dbConfig = require('../config/database.config.js')
var knex = require('knex')(dbConfig)

exports.up = function() {
  return knex.schema
  .createTableIfNotExists('users', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.string('email').unique().notNullable();
    table.string('facebook_id').unique();
    table.timestamps();
   })//.createTableIfNotExists('roles', function(table) {
  //   table.increments('id').primary();
  //   table.string("name").unique().notNullable();
  //   table.string("code").unique().notNullable();
  //   table.timestamps();
  // }).createTableIfNotExists('users_roles', function(table) {
  //   table.integer('user_id').unsigned().references('users.id').notNullable();
  //   table.integer('role_id').unsigned().references('roles.id').notNullable();
  // })
};

exports.down = function() {
  return knex.schema
  .dropTable('users')
};

module.exports = exports;