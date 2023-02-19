const express = require('express');
const mongoose = require('mongoose');
const todoController = require('./controllers/todoController');

const app = express();
const port = process.env.PORT || 3000;

app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// connection url
const url = 'mongodb://0.0.0.0:27017/todoDB';
// strictQuery will become false in mongoose 7
mongoose.set('strictQuery', false);
// connect to db
mongoose.connect(url, () => {
  console.log('Connected to MongoDB');
});

// create schema with validation
const todoSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// create model
const Todo = mongoose.model('Todo', todoSchema);

async function insertDefault() {
  // items array
  items = [
    new Todo({ name: 'Welcome to your todo list!' }),
    new Todo({ name: 'Hit the + button to add a new item.' }),
    new Todo({ name: 'Check the box to remove the item.' }),
  ];

  try {
    const saveItems = await Todo.insertMany(items);
    console.log('SAVE', saveItems, '\n');
  } catch (err) {
    console.log(err);
  }
}

(async function getItems() {
  var list = [];
  try {
    const todos = await Todo.find({});
    todos.forEach((element) => {
      list.push(element.name);
    });
  } catch (err) {
    console.log(err);
  } finally {
    todoController(app, list);
  }
})();

app.listen(port, function () {
  console.log(`Server started on port ${port}..`);
});
