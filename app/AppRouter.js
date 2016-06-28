'use strict';
const NamedRouter = require('named-router');
const MainController = require('./controllers/MainController');

const render = (viewName, params) => (req, res) => res.render(viewName, params);

/**
 * Singleton router for all the frontend routes
 */
class AppRouter extends NamedRouter {
    constructor() {
        super();
        this.get('/', 'index', MainController.getHomePage);
        this.get('/europe', 'eafeChart', MainController.getEuropeAllocationChart);
    }
}

module.exports = new AppRouter();
