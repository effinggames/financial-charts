var pages = {};

pages.home = function(req, res) {
    res.render('home', { title: 'Funky Town' });
};

module.exports = pages;