const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// export
module.exports = function (app, items, Todo) {
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
    // get the name of the new item
    const itemName = req.body.newItem;
    // insert the item into db and add to arr
    if (insertItem(Todo, itemName)) items.push(itemName);

    // load page
    res.redirect('/');
  });

  app.post('/delete', urlencodedParser, function (req, res) {
    const itemName = req.body.deleteItem;

    // delete the item from db
    if (deleteItem(Todo, itemName)) {
      const index = items.indexOf(itemName);
      if (index > -1) {
        // only splice array when item is found
        items.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    // load page
    res.redirect('/');
  });
};

// insert item into db
async function insertItem(Todo, itemName) {
  // new item
  var item = new Todo({ name: itemName });
  // save in db
  try {
    let saveItem = await item.save();
    console.log('[INSERT DB]', saveItem.name);
    return saveItem;
  } catch (err) {
    console.log(err);
  }
}

// delete item from db
async function deleteItem(Todo, itemName) {
  // delete
  try {
    let deleteItem = await Todo.deleteOne({ name: itemName });
    console.log('[DELETE DB]', deleteItem);
    return deleteItem;
  } catch (err) {
    console.log(err);
  }
}
