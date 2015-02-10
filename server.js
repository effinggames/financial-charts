const cluster = require('cluster');

if (cluster.isMaster) {
    let cpuCount = require('os').cpus().length;

    if (process.env.NODE_ENV === 'production')
        console.log('Running in production mode!');
    else {
        console.log('Running in development mode!');
        cpuCount = 1;
    }

    for (let i = 0; i < cpuCount; i++)
        cluster.fork();

    cluster.on('exit', (worker) => {
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });

} else {
    const express = require('express'),
        config = require('./config/config'),
        app = config(express());

    console.log('Worker ' + cluster.worker.id + ' running!');

    app.listen(app.get('port'), () => {
        console.log('Express server listening on port ' + app.get('port'));
    });
}