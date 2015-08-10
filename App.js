'use strict';
const Express = require('express');
const Compress = require('compression');
const AppRouter = require('./app/AppRouter');
const Nunjucks = require('nunjucks');

const viewDir = __dirname + '/app/views';
const publicDir = __dirname + '/public';

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
        this.set('views', viewDir);
        this.set('port', process.env.PORT || 8000);

        Nunjucks.configure(viewDir, {
            autoescape: true,
            trimBlocks: true,
            lstripBlocks: true,
            express: this,
            tags: {
                variableStart: '[[',
                variableEnd: ']]'
            }
        }).addGlobal('linkTo', (name, params) =>
            AppRouter.build(name, params)
        );
    }
}

module.exports = App;