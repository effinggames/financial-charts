'use strict';

/**
 * Singleton controller for simple pages
 */
class PageController {
    home(req, res) {
        res.render('pages/home', {title: 'Home'});
    };
}

module.exports = new PageController();