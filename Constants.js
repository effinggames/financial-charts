'use strict';
const Assert = require('assert');

class Constants {
    constructor() {
        this.PostgresConnectionString = process.env.DATABASE_URL;
        Assert(process.env.DATABASE_URL, 'ENV variable: DATABASE_URL is not set!');
    }
}

module.exports = new Constants();
