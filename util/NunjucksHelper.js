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
     init(expressApp, namedRouter, templateDir) {
        const env = Nunjucks.configure(templateDir, {
            autoescape: true,
            express: expressApp
        });
        env.addGlobal('linkTo', (name, params) => namedRouter.build(name, params));
    };
}

module.exports = new NunjucksHelper();
