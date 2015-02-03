var hbs = require('hbs'),
    router = require('../app/router'),
    hbsHelpers = {};

hbsHelpers.init = function() {
    hbs.registerHelper('link_to', function(name, params) {
        if (typeof params === 'string')
            params = JSON.parse(params);
        
        return router.build(name, params);
    });
};

module.exports = hbsHelpers;