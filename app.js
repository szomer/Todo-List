const express = require('express');
const todoController = require('./controllers/todoController');

const app = express();
const port = process.env.PORT || 3000;

app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

todoController(app);

app.listen(port, function () {
  console.log(`Server started on port ${port}..`);
});
