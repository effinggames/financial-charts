'use strict';
const Assert = require('assert');

const getEnvVariable = function(name) {
  const value = process.env[name];
  Assert(value, `ENV variable: $name is not set!`);
  return value;
};

class Constants {
  constructor() {
    //Mandatory constants
    this.PostgresConnectionString = getEnvVariable('DATABASE_URL');
    this.GoogleAnalyticsId = process.env['GOOGLE_ANALYTICS_ID'];
  }
}

module.exports = new Constants();
