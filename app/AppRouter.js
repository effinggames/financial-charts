'use strict';
const NamedRouter = require('named-router');
const PageController = require('./controllers/PageController');

/**
 * Singleton router for all the frontend routes
 */
class AppRouter extends NamedRouter {
    constructor() {
        super();
        this.get('/', 'home', PageController.home);
    }
}

module.exports = new AppRouter();
