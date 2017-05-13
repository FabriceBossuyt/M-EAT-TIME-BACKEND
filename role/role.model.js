'use strict';

const bookshelf = require('../config/bookshelf.config.js');
const User = require('../user/user.model.js');

module.exports = bookshelf.Model.extend({
    tableName: 'role',
    hasTimeStamps: true, 
    users() {
        return this.belongsToMany(User, 'user_role');
    }
});