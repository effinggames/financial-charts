'use strict';
const Express = require('express');
const Compress = require('compression');
const AppRouter = require('./app/AppRouter');
const NunjucksHelper = require('./util/NunjucksHelper');

const templateDir =  `${__dirname}/app/templates`;
const publicDir = `${__dirname}/public`;

/**
 * Main express app setup/configuration class
 */
class App extends Express {
    constructor() {
        super();
        this.use(Compress());
        this.use(AppRouter);
        this.use(Express.static(publicDir));

        this.set('view engine', 'html');
        this.set('views', templateDir);
        this.set('port', process.env.PORT || 8000);

        NunjucksHelper.init(this, AppRouter, templateDir);
    }
}

module.exports = App;