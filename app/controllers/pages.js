'use strict';
const Pages = {};

Pages.home = (req, res) => {
    res.render('pages/home', {title: 'Home'});
};

module.exports = Pages;