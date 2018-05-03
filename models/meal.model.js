'use strict';

const bookshelf = require('../config/bookshelf.config.js');
const User = require('../models/user.model.js');
const Ingredient = require('../models/ingredient.model.js');

module.exports = bookshelf.Model.extend({
    tableName: 'meals',
    hasTimeStamps: true, 
    users() {
        return this.belongsToMany(User, 'user_meal');
    }, 
    ingredients () {
        return this.belongsToMany(Ingredient, 'meal_ingredient')
    }
    
});