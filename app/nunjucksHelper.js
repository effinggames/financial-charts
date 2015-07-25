'use strict';
const AppRouter = require('./AppRouter');
const Nunjucks = require('nunjucks');

/**
 * Singleton helper class to setup nunjucks / named router
 */
class NunjucksHelper {
    /**
     * Enable the linkTo function in swig templates,
     * and setups configuration w/ express
     * @example linkTo('home') // '/home'
     */
     init(app) {
        const env = Nunjucks.configure(__dirname+'/templates', {
            autoescape: true,
            express: app
        });
        env.addGlobal('linkTo', name => AppRouter.build(name, arguments));
    };
}

module.exports = new NunjucksHelper();