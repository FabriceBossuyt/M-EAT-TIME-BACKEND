'use strict';

const bookshelf = require('../config/bookshelf.config.js');
const User = require('../models/user.model.js');
const Meal = require('../models/meal.model.js');
const Ingredient = require('../models/ingredient.model.js');

module.exports = bookshelf.Model.extend({
    tableName: 'roles',
    hasTimeStamps: true, 
    users() {
        return this.belongsToMany(User, 'user_recipe');
    },
    ingredients () {
        return this.belongsToMany(Ingredient, 'recipe_ingredient')
    }, 
    meals() {
        return this.belongsToMany(Meal, 'meal_recipe')
    }
});