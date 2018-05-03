'use strict';

const bookshelf = require('../config/bookshelf.config.js');
const User = require('../models/user.model.js');
const Recipe = require('../models/recipe.model.js')

module.exports = bookshelf.Model.extend({
    tableName: 'ingredients',
    hasTimeStamps: true, 
    users() {
        return this.belongsToMany(User, 'user_ingredient');
    },
    recipes(){
        return this.belongsToMany(Recipe, 'recipe_ingredient')
    }, 
    meals() {
        return this.belongsToMany(Meal, 'meal_ingredient')
    }
});