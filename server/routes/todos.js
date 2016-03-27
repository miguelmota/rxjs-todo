'use strict';

const express = require('express');
const Rx = require('rx');

const models = require('../models');
const router = express.Router();

const requests = {
  saveTodos$: new Rx.Subject(),
  getTodos$: new Rx.Subject()
};

// Observable for getting todos
requests.getTodos$
.map(event => {
  return Rx.Observable.forkJoin(getTodos(), (todos) => [event, todos]);
})
.concatAll()
// Format response
.map(([event, todos]) => {
  const data = {
    data: {todos}
  };

  return [event, data];
})
// Emit response
.subscribe(([event, data]) => {
  event.response.json(data);
}, handleError);

// Observable for saving todos
requests.saveTodos$
// Get todos from body
.map(event => {
  const {todos} = event.request.body;
  return [event, todos];
})
// create or update todos in database
.map(([event, todos]) => {
  const sources = todos.map(todo => createOrUpdateTodo(todo));
  return Rx.Observable.forkJoin(sources, () => [event, todos]);
})
// Return a single array
.concatAll()
// Format response
.map(([event, todos]) => {
  const data = {
    data: {todos}
  };

  return [event, data];
})
// Emit response
.subscribe(([event, data]) => {
  event.response.json(data);
}, handleError);

router.get('/', (request, response) => requests.getTodos$.onNext({request, response}));
router.post('/', (request, response) => requests.saveTodos$.onNext({request, response}));

function createOrUpdateTodo(todo) {
  const {task, id} = todo;

  return models.Todo.findOrCreate({
    where: {id},
    defaults: {id, task}
  }).spread((result, isCreated)  => {
    if (!isCreated) {
      return models.Todo.update({task}, {where: {id}});
    }
    return todo;
  });
}

function getTodos() {
  return models.Todo.findAll()
  .then(todos => {
    return todos.map(({task, id}) => ({task, id}));
  });
}

function handleError(error) {
  console.error(error);
}

module.exports = router;
