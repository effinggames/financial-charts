'use strict';
const Router = require('./router');
const Nunjucks = require('nunjucks');

const NunjucksHelper = {};

/**
 * Enable the linkTo function in swig templates,
 * and disables caching (uses express's caching instead)
 * @example linkTo('home') // '/home'
 */
NunjucksHelper.init = app => {
    const env = Nunjucks.configure(__dirname+'/templates', {
        autoescape: true,
        express: app
    });
    env.addGlobal('linkTo', name => Router.build(name, arguments));
};

module.exports = NunjucksHelper;