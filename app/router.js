'use strict';
const Router = require('named-router')();
const PageController = require('./controllers/pages');

Router.get('/', 'home', PageController.home);

module.exports = Router;
