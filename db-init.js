'use strict'

var conn = {
  host: 'localhost',
  user: 'root',
  password: 'jezusiship',
  charset: 'utf8'
}

var Promise = require('bluebird');

var userMigration = require('./migrations/user.migration.js')
var roleMigration = require('./migrations/role.migration.js');
var passwordResetMigration = require('./migrations/password_reset_token.migration.js');
var userRoleMigration = require('./migrations/user_role.migration.js');
var ingredientMigration = require('./migrations/ingredient.migration.js');
var recipeMigration = require('./migrations/recipe.migration.js');
var mealMigration = require('./migrations/meal.migration.js');
var mealIngredientMigration = require('./migrations/meal_ingredient.migration.js');
var mealRecipeMigration = require('./migrations/meal_recipe.migration.js');
var recipeIngredientMigration = require('./migrations/recipe_ingredient.migration.js');
var userIngredientMigration = require('./migrations/meal_recipe.migration.js');
var userMealMigration = require('./migrations/user_meal.migration.js');
var userRecipeMigration = require('./migrations/user_recipe.migration.js');


var knex = require('knex')(require('./config/database.config.js'));
var knex2 = require('knex')({ client: 'mysql', connection: conn });

module.exports = function initDb() {
  knex2.raw("CREATE DATABASE IF NOT EXISTS MeatTime")
    .then(function () {

      Promise.coroutine(function* () {

        yield knex.schema.hasTable('users').then(function (exists) {
          if (!exists) {
            userMigration.up().then(function () {
              console.log("User table made")
            });
          }
        })

        yield knex.schema.hasTable('roles').then(function (exists) {
          if (!exists) {
            roleMigration.up().then(function () {
              console.log("Role table made")
            });
          }
        })

        yield knex.schema.hasTable('user_role').then(function (exists) {
          if (!exists) {
            userRoleMigration.up().then(function () {
              console.log("User_role table made")
            });
          }
        })

        yield knex.schema.hasTable('password_reset_token').then(function (exists) {
          if (!exists) {
            passwordResetMigration.up().then(function () {
              console.log("Password_reset_token table made")
            })
          }
        })

        yield knex.schema.hasTable('ingredients').then(function (exists) {
          if (!exists) {
            ingredientMigration.up().then(function () {
              console.log("Ingredients table made")
            })
          }
        })

        yield knex.schema.hasTable('recipes').then(function (exists) {
          if (!exists) {
            recipeMigration.up().then(function () {
              console.log("Recipes table made")
            })
          }
        })

        yield knex.schema.hasTable('meals').then(function (exists) {
          if (!exists) {
            mealMigration.up().then(function () {
              console.log("Meals table made")
            })
          }
        })

        yield knex.schema.hasTable('meal_ingredient').then(function (exists) {
          if (!exists) {
            mealIngredientMigration.up().then(function () {
              console.log("Meal Ingredient table made")
            })
          }
        })

        yield knex.schema.hasTable('meal_recipe').then(function (exists) {
          if (!exists) {
            mealRecipeMigration.up().then(function () {
              console.log("Meal recipe table made")
            })
          }
        })

        yield knex.schema.hasTable('recipe_ingredient').then(function (exists) {
          if (!exists) {
            recipeIngredientMigration.up().then(function () {
              console.log("Recipe Ingredient table made")
            })
          }
        })

        yield knex.schema.hasTable('user_ingredient').then(function (exists) {
          if (!exists) {
            userIngredientMigration.up().then(function () {
              console.log("User Ingredient table made")
            })
          }
        })

        yield knex.schema.hasTable('user_meal').then(function (exists) {
          if (!exists) {
            userMealMigration.up().then(function () {
              console.log("User meal table made")
            })
          }
        })

        yield knex.schema.hasTable('user_recipe').then(function (exists) {
          if (!exists) {
            userRecipeMigration.up().then(function () {
              console.log("User Recipe table made")
            })
          }
        })

      })()
    })
}