'use strict';
const NamedRouter = require('named-router');
const MainController = require('./controllers/MainController');

/**
 * Singleton router for all the frontend routes
 */
class AppRouter extends NamedRouter {
    constructor() {
        super();
        this.get('/', 'index', MainController.getHomePage);
        this.get('/europe', 'eafeChart', MainController.getEuropeAllocationChart);
        this.get('/usa-unemployment', 'usaUnemployment', MainController.getUnemploymentChart);
        this.get('/yield-curve', 'yieldCurve', MainController.getYieldCurveChart);
    }
}

module.exports = new AppRouter();
