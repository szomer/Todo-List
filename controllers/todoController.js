const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const items = [];

module.exports = function (app) {
  app.get('/', function (req, res) {
    // date
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };
    const day = new Date().toLocaleDateString('en-DE', options);

    // render page
    res.render('list', { date: day, todos: items });
  });

  app.post('/', urlencodedParser, function (req, res) {
    const item = req.body.newItem;
    items.push(item);
    console.log('item', item);
    res.redirect('/');
  });
};
