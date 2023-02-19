const express = require('express');
const mongoose = require('mongoose');
const todoController = require('./controllers/todoController');

// connection url
const url = 'mongodb://0.0.0.0:27017/todoDB';
const port = process.env.PORT || 3000;
const app = express();
app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

var Todo, List, todoSchema, listSchema;

// items array
var defaultItems = [];

// IIFE
(async function run() {
  // db
  try {
    // strictQuery will become false in mongoose 7
    mongoose.set('strictQuery', false);
    // connect to db
    await mongoose.connect(url);
    console.log('Database connected..');
    // create schema with validation
    todoSchema = await mongoose.Schema({
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
    // push items to default list
    defaultItems.push(new Todo({ name: 'Welcome to your todo list!' }));
    defaultItems.push(
      new Todo({ name: 'Hit the + button to add a new item.' })
    );

    // get the items from db
    getItems();
  }

  try {
    listSchema = await mongoose.Schema({
      name: { type: String, required: true },
      items: [todoSchema],
    });

    List = mongoose.model('List', listSchema);
  } catch (err) {
    console.log('err List');
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
        todoController(app, list, Todo, List, defaultItems);
      }
    }
  }

  // insert default items into db
  async function insertDefault() {
    try {
      const saveItems = await Todo.insertMany(defaultItems);
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
