'use strict';
const Express = require('express');
const Compress = require('compression');
const AppRouter = require('./app/AppRouter');
const NunjucksHelper = require('./app/NunjucksHelper');

/**
 * Main express app setup/configuration class
 */
class App extends Express {
    constructor() {
        super();
        this.use(Compress());
        this.use(AppRouter);
        this.use(Express.static(__dirname + '/public'));

        this.set('view engine', 'html');
        this.set('views', __dirname + '/app/templates');
        this.set('port', process.env.PORT || 8000);

        NunjucksHelper.init(this);
    }
}

module.exports = App;