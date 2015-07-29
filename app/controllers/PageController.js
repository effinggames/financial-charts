'use strict';

/**
 * Singleton controller for simple pages
 */
class PageController {
    home(req, res) {
        res.render('home', {title: 'Home'});
    };
}

module.exports = new PageController();