const express = require('express');
const mongoose = require('mongoose');
const todoController = require('./controllers/todoController');

const app = express();
const port = process.env.PORT || 3000;

app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
// connection url
const url = 'mongodb://0.0.0.0:27017/todoDB';

// IIFE
(async function run() {
  var Todo;

  // db
  try {
    // strictQuery will become false in mongoose 7
    mongoose.set('strictQuery', false);
    // connect to db
    await mongoose.connect(url);
    console.log('Database connected..');
    // create schema with validation
    const todoSchema = await mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
    });

    // create model
    Todo = mongoose.model('Todo', todoSchema);
  } catch (err) {
    console.log(err);
  } finally {
    // get the items from db
    getItems();
  }

  // get the list form db
  async function getItems() {
    var list = [];

    try {
      const todos = await Todo.find({});
      todos.forEach((element) => {
        list.push(element.name);
      });
    } catch (err) {
      console.log(err);
    } finally {
      // no items in collection
      if (list.length === 0) {
        // insert default values
        insertDefault();
      } else {
        // refer to controller to render the page
        todoController(app, list, Todo);
      }
    }
  }

  // insert default items into db
  async function insertDefault() {
    // items array
    items = [
      new Todo({ name: 'Welcome to your todo list!' }),
      new Todo({ name: 'Hit the + button to add a new item.' }),
      new Todo({ name: 'Check the box to remove the item.' }),
    ];

    try {
      const saveItems = await Todo.insertMany(items);
      console.log('[INSERT DB]', saveItems.length, 'entries');
    } catch (err) {
      console.log(err);
    } finally {
      getItems();
    }
  }
})();

app.listen(port, function () {
  console.log(`Server started on port ${port}..`);
});
