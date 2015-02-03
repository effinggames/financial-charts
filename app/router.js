var router = require('named-router')();
var pages = require('./pages');

router.get('/', 'home', pages.home);

module.exports = router;
