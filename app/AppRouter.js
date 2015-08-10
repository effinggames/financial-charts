'use strict';
const NamedRouter = require('named-router');

/**
 * Singleton router for all the frontend routes
 */
class AppRouter extends NamedRouter {
    constructor() {
        super();
        this.get('/', 'index', (req, res) => res.render('index'));
    }
}

module.exports = new AppRouter();
