'use strict';
const Nunjucks = require('nunjucks');

/**
 * Singleton helper class to setup nunjucks / named router
 */
class NunjucksHelper {
    /**
     * Enable the linkTo function in templates,
     * and setups express to use nunjucks templates
     * @example NunjucksHelper.init(app, router, __dirname+'/app/templates');
     * @example linkTo('home') // '/home'
     */
     init(expressApp, nameRouter, templateDir) {
        const env = Nunjucks.configure(templateDir, {
            autoescape: true,
            express: expressApp
        });
        env.addGlobal('linkTo', name => nameRouter.build(name, arguments));
    };
}

module.exports = new NunjucksHelper();
