var hbs = require('hbs');

var helpers = {
    init: function(namedRouter) {
        hbs.registerHelper('link_to', function(name, params) {
            if (typeof params === 'string')
                params = JSON.parse(params);
            return namedRouter.build(name, params);
        });
    }
};

module.exports = helpers;