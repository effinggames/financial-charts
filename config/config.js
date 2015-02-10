const hbs = require('hbs'),
    express = require('express'),
    compress = require('compression'),
    router = require('../app/router'),
    hbsHelpers = require('./hbsHelpers');

hbsHelpers.init();

const setupApp = (app) => {
    app.use(compress());
    app.use(router);
    app.use(express.static(__dirname + '/../public'));

    app.set('view engine', 'hbs');
    app.set('views', __dirname + '/../app/views');
    app.set('port', process.env.PORT || 8000);

    return app;
};

module.exports = setupApp;