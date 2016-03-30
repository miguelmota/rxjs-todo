'use strict';

const express = require('express');
const Rx = require('rx');

const router = express.Router();
const TodoActions = require('../actions/TodoActions');

/**
 * @desc Observables for handling requests.
 */
const requests = {
  /**
   * @desc Saves todos to database.
   */
  saveTodos$: new Rx.Subject(),

  /**
   * @desc Returns saved todos from database.
   */
  getTodos$: new Rx.Subject(),

  /**
   * @desc Deletes todos from datbase.
   */
  deleteTodos$: new Rx.Subject()
};

/**
 * @desc Observable for getting todos.
 */
requests.getTodos$
.map(event => {
  return Rx.Observable.forkJoin(TodoActions.getTodos(), (todos) => [event, todos]);
})
// Return a single array.
.concatAll()
// Format response.
.map(([event, todos]) => {
  const data = {
    data: {todos}
  };

  return [event, data];
})
// Emit response.
.subscribe(([event, data]) => {
  event.response.json(data);
}, handleError);

/**
 * @desc Observable for saving todos.
 */
requests.saveTodos$
// Get todos from request body.
.map(event => {
  const {todos} = event.request.body;
  return [event, todos];
})
// Create or update todos in database.
.map(([event, todos]) => {
  if (!Array.isArray(todos)) {
    return event.response.json(400, {
      error: '`todos` must be an array.'
    });
  }

  const sources = todos.map(todo => TodoActions.createOrUpdateTodo(todo));
  return Rx.Observable.forkJoin(sources, () => [event, todos]);
})
// Return a single array.
.concatAll()
// Format response.
.map(([event, todos]) => {
  const data = {
    data: {todos}
  };

  return [event, data];
})
// Emit response.
.subscribe(([event, data]) => {
  event.response.json(data);
}, handleError);

/**
 * @desc Observable for deleting todos.
 */
requests.deleteTodos$
// Get todo ids from request body.
.map(event => {
  const {todos} = event.request.body;
  return [event, todos];
})
// Delete todos from database.
.map(([event, todos]) => {
  if (!Array.isArray(todos)) {
    return event.response.json(400, {
      error: '`todos` must be an array of IDs.'
    });
  }

  const sources = todos.map(todoId => TodoActions.deleteTodo(todoId));
  return Rx.Observable.forkJoin(sources, () => [event, todos]);
})
// Return a single array.
.concatAll()
// Format response.
.map(([event, todos]) => {
  const data = {
    data: {todos}
  };

  return [event, data];
})
// Emit response.
.subscribe(([event, data]) => {
  event.response.json(data);
}, handleError);

/**
 * @desc Set up route handlers to use observables to process request.
 */
router.get('/', (request, response) => requests.getTodos$.onNext({request, response}));
router.post('/', (request, response) => requests.saveTodos$.onNext({request, response}));
router.delete('/', (request, response) => requests.deleteTodos$.onNext({request, response}));

/**
 * handleError
 * @desc Generic error handler that logs message.
 * @type {Function}
 * @param {String} error - error message
 */
function handleError(error) {
  console.error(error);
}

module.exports = router;
