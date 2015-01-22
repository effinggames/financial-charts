var Router = require('named-router'),
    router = new Router();

router.get('/test', 'home', function(req, res) {
    res.render('home', { title: 'Funky Town' });
});

module.exports = router;