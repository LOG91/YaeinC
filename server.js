const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Todo = require('./todo.model');
const Leader = require('./todo.model');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const todoRoutes = express.Router();
app.use('/todos', todoRoutes);


const addMember = ({ name, section, cellName, cellNameKr, age, cc = false, mc = false, yc = false, members }) => {
  return (
  {
    name,
    section,
    cellName,
    cellNameKr,
    age,
    cc,
    mc,
    yc,
    members: members.map(member => ({ name: member, section, cellName, cc, mc, yc})),
  }
)}

todoRoutes.get('/api/leaders', function(req,res){
  Leader.find(function(err, leaders){
      if(err) return res.status(500).send({error: 'database failure'});
      res.json(leaders);
  })
});

todoRoutes.route('/admin').get((req, res) => {
  console.log('admin!!!')
  res.send({ a: 123 });
})

app.get('/api/section/:section', (req, res) => {
  const cellName = req.params.section;
  console.log(cellName,898989896757);
  Leader.find({ cellName: cellName }, (err, leader) => {
    if (err) {
      console.log(err);
  } else {
      console.log(leader);
      res.json(leader);
  }
  })
})

app.post('/api/add', (req, res, next) => {
  console.log(req.body);
  const { name, age, cellName, cellNameKr, section, members } = req.body;
  const mem = new Leader(addMember({ name, age, cellName, cellNameKr, section, members }));
  mem.save((err, book) => {
    if(err) return console.error(err);
  })
  res.send({ a: 1, b: 2, c:3, d:4 });
})

todoRoutes.route('/').get(function(req, res) {
  console.log('todos!!!')
  Todo.find(function(err, todos) {
      if (err) {
          console.log(err);
      } else {
          res.json(todos);
      }
  });
});
todoRoutes.route('/:id').get(function(req, res) {
  let id = req.params.id;
  Todo.findById(id, function(err, todo) {
      res.json(todo);
  });
});
todoRoutes.route('/add').post(function(req, res) {
  let todo = new Todo(req.body);
  todo.save()
      .then(todo => {
          res.status(200).json({'todo': 'todo added successfully'});
      })
      .catch(err => {
          res.status(400).send('adding new todo failed');
      });
});
todoRoutes.route('/update/:id').post(function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
      if (!todo)
          res.status(404).send("data is not found");
      else
          todo.todo_description = req.body.todo_description;
          todo.todo_responsible = req.body.todo_responsible;
          todo.todo_priority = req.body.todo_priority;
          todo.todo_completed = req.body.todo_completed;

          todo.save().then(todo => {
              res.json('Todo updated!');
          })
          .catch(err => {
              res.status(400).send("Update not possible");
          });
  });
});

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
  console.log("MongoDB database connection established successfully");
})

// API calls
app.get('/api/hello', (req, res) => {
  console.log('hello World!!');
  res.send({ express: 'API Server connected :)' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `검색어: ${req.body.post}`,
  );
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'front/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'front/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
