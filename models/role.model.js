'use strict';

const bookshelf = require('../config/bookshelf.config.js');
const User = require('../models/user.model.js');

module.exports = bookshelf.Model.extend({
    tableName: 'roles',
    hasTimeStamps: true, 
    users() {
        return this.belongsToMany(User, 'user_role');
    }
});