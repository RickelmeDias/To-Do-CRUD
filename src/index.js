const express = require('express');
const cors = require('cors');
const req = require('express/lib/request');
const { v4: uuidv4 } = require('uuid');
const res = require('express/lib/response');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers;
  const user = users.find(user => user.username == username);

  if (!user) {
    return response.status(400).json({
      error: 'This username do not exists'
    });
  }else{
    request.user = user;
    return next();
  }
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;

  const userExists = users.some((user) => user.username === username);
  if ( userExists ) {
    return response.status(400).json({
      error: 'This username alerady exists'
    });
  }

  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  }

  users.push(user)
  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  return response.status(200).send(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {title, deadline} = request.body;
  const toDoFormat = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(toDoFormat);

  return response.status(201).send(toDoFormat);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {title, deadline} = request.body;
  const {id} = request.params;

  let todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({error: "Do not exists this to-do"});
  }else{
    const date = new Date(deadline);  
    todo.title = title;
    todo.deadline = date;
  }
  return response.json(todo).status(204);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params;

  let todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({error: "Do not exists this to-do"});
  }

  if (todo.done === true) {
    return response.status(404).json({error: "This to-do already is done."});  
  }else{
    todo.done = true;
  }

  return response.json(todo).status(204);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find((todo) => todo.id === id);
  if (!todo) {
    return response.status(404).json({error: "Do not exists this to-do"});
  }

  user.todos.splice(todo, 1);
  return response.status(204).send();
});

module.exports = app;