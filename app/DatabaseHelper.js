'use strict';
const Constants = require('../Constants');
const Knex = require('knex');

/**
 * Initializes the shared db connection pool
 */
class DatabaseHelper {
    constructor() {
        this.knex = new Knex({
            client: 'pg',
            connection: Constants.PostgresConnectionString
        });
    }
}

module.exports = new DatabaseHelper();
