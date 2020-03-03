'use strict';
const Express = require('express'),
  Compress = require('compression'),
  AppRouter = require('./AppRouter'),
  Nunjucks = require('nunjucks'),
  Constants = require('../Constants');

const viewDir = __dirname + '/views';
const publicDir = __dirname + '/../public';

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

    const env = Nunjucks.configure(viewDir, {
      autoescape: true,
      trimBlocks: true,
      lstripBlocks: true,
      express: this,
      tags: {
        variableStart: '[[',
        variableEnd: ']]'
      }
    });

    env.addGlobal('GoogleAnalyticsId', Constants.GoogleAnalyticsId);
    env.addGlobal('linkTo', (name, params) => AppRouter.build(name, params));
    env.addFilter('stringify', value => JSON.stringify(value));
    env.addFilter('toFixed', (value, num) => value.toFixed(num));
  }
}

module.exports = App;
