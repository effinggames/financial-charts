const router = require('named-router')(),
    pages = require('./pages');

router.get('/', 'home', pages.home);

module.exports = router;
