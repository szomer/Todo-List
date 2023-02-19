const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// export
module.exports = function (app, items, Todo, List, defaultItems) {
  app.get('/', function (req, res) {
    day = 'Today';
    // render page
    res.render('list', { title: day, todos: items });
  });

  app.post('/', urlencodedParser, function (req, res) {
    // get the name of the new item
    const itemName = req.body.newItem;
    const listTitle = req.body.list;

    if (listTitle === 'Today') {
      // insert the item into db and add to arr
      if (insertItem(Todo, itemName)) items.push(itemName);
      // load page
      res.redirect('/');
    } else {
      const item = new Todo({
        name: itemName,
      });
      List.findOne({ name: listTitle }, function (err, foundList) {
        foundList.items.push(item);
        foundList.save();
        res.redirect('/' + listTitle);
      });
    }
  });

  app.post('/delete', urlencodedParser, async function (req, res) {
    const itemName = req.body.deleteItem;
    const listTitle = req.body.list;

    console.log('item', itemName);
    console.log('list', listTitle);

    if (listTitle === 'Today') {
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
    } else {
      try {
        const deleteItem = await List.findOneAndUpdate(
          { name: listTitle },
          { $pull: { items: { name: itemName } } }
        );
        console.log('[DELETE DB]', deleteItem);
      } catch (err) {
        console.log(err);
      } finally {
        res.redirect('/' + listTitle);
      }
    }
  });

  app.post('/search', urlencodedParser, function (req, res) {
    const searchValue = req.body.search;
    console.log('search', req.body.search);

    res.redirect('/' + searchValue);
  });

  app.get('/:path', urlencodedParser, async function (req, res) {
    var arr = [];

    const listName =
      req.params.path.charAt(0).toUpperCase() +
      req.params.path.slice(1).toLowerCase();

    try {
      // find in db
      const findList = await List.findOne({ name: listName });

      if (findList) {
        // add the names to arr
        findList.items.forEach((element) => {
          arr.push(element.name);
        });

        if (arr.length === 0) {
          defaultItems.forEach((element) => {
            arr.push(element.name);
          });
        }

        // render page
        res.render('list', {
          title: findList.name,
          todos: arr,
        });
      } else {
        // create new list
        const list = new List({
          name: listName,
          items: defaultItems,
        });
        const saveItem = await list.save();
        console.log('[INSERT DB]', saveItem.name);
        res.redirect('/' + listName);
      }
    } catch (err) {
      console.log(err);
    }
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
