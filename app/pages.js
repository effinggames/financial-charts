const pages = {};

pages.home = (req, res) => {
    res.render('home', { title: 'Funky Town' });
};

module.exports = pages;