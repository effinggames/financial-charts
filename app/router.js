var router = require('named-router')();

router.get('/', 'home', function(req, res) {
    res.render('home', { title: 'Funky Town' });
});

module.exports = router;
