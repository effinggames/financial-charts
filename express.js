'use strict';
const Express = require('express');
const Compress = require('compression');
const AppRouter = require('./app/router');
const NunjucksHelper = require('./app/nunjucksHelper');

const App = () => {
    const app = Express();
    app.use(Compress());
    app.use(AppRouter);
    app.use(Express.static(__dirname + '/public'));

    app.set('view engine', 'html');
    app.set('views', __dirname + '/app/templates');
    app.set('port', process.env.PORT || 8000);

    NunjucksHelper.init(app);
    return app;
};

module.exports = App;