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

        var env = Nunjucks.configure(viewDir, {
            autoescape: true,
            trimBlocks: true,
            lstripBlocks: true,
            express: this,
            tags: {
                variableStart: '[[',
                variableEnd: ']]'
            }
        });

        env.addGlobal('linkTo', (name, params) =>
            AppRouter.build(name, params)
        );
        env.addFilter('stringify', (value) =>
            JSON.stringify(value)
        );
    }
}

module.exports = App;