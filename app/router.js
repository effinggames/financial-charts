var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('home', {title: 'Funky Town'});
});

module.exports = router;