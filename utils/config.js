var hbs = require('hbs'),
    path = require('path'),
    express = require('express'),
    compress = require('compression'),
    router = require('../app/router'),
    hbsHelpers = require('./hbsHelpers');

hbsHelpers.init(router);

var configApp = function(app) {
    app.use(compress());
    app.use(router);
    app.use(express.static(__dirname + '/../public'));

    app.set('view engine', 'hbs');
    app.set('views', __dirname + '/../app/views');
    app.set('port', process.env.PORT || 8000);

    if (process.env.NODE_ENV === 'production') {
        app.enable('view cache');
    }
    return app;
};

module.exports = configApp;