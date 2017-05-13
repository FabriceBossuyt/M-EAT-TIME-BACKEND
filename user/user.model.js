'use strict'

const bookshelf = require('../config/bookshelf.config.js');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const Role = require('../role/role.model.js');
const securityConfig = require('../config/security.config.js');

module.exports = bookshelf.Model.extend({
    tableName: 'users',
    hasTimeStamps : true, 
    roles() {
        return this.belongsToMany(Role, 'user_role');
    },
    validPassword(password) {
        return bcrypt.compareAsync(password, this.attributes.password);
    },
    initialize() {
        this.on('saving', model => {
            if (!model.hasChanged('password')) return;

            return Promise.coroutine(function* () {
                const salt = yield bcrypt.genSaltAsync(securityConfig.saltRounds);
                const hashedPassword = yield bcrypt.hashAsync(model.attributes.password, salt);
                model.set('password', hashedPassword);
            })();
        });
    }
});