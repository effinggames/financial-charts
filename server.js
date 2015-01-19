var cluster = require('cluster');

if (cluster.isMaster) {
    var cpuCount = require('os').cpus().length;

    if (process.env.NODE_ENV === 'production')
        console.log('Running in production mode!');
    else 
        console.log('Running in development mode!'),
        cpuCount = 1;
    
    for (var i = 0; i < cpuCount; i++)
        cluster.fork();

    cluster.on('exit', function (worker) {
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });
} else {
    var hbs = require('hbs'),
        path = require('path'),
        express = require('express'),
        request = require('request'),
        compress = require('compression'),
        router = require('./app/router') ;

    console.log('Worker ' + cluster.worker.id + ' running!');
    
    var app = express();

    app.use(compress());
    app.use(router);
    app.use(express.static(path.join(__dirname, './public')));

    app.set('view engine', 'hbs');
    app.set('views', __dirname + '/app/views');
    app.set('port', process.env.PORT || 8000);

    if(process.env.NODE_ENV === 'production'){
        app.enable('view cache');
    }

    app.listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });
}