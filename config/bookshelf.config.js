'use strict'

const dbConfig = require('./database.config.js');
const knex = require('knex')(dbConfig);

module.exports = require('bookshelf')(knex);