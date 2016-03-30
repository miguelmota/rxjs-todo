'use strict';

const models = require('../models');

/**
 * TodoAction
 * @desc Contains todo actions.
 * @type {Object}
 */
const TodoActions = {
  /**
   * getTodos
   * @desc Returns todos from database.
   * @type {Function}
   * @return {Promise}
   */
  getTodos() {
    return models.Todo.findAll()
    .then(todos => {
      return todos.map(({task, id}) => ({task, id}));
    });
  },

  /**
   * createOrUpdateTodo
   * @desc Creates a new todo, or updates the todo if
   * it already exists based on ID.
   * @type {Function}
   * @param {Object} todo - todo object
   * @param {String} todo.task - todo task value
   * @param {Number} [todo.id] - todo id
   * @return {Promise}
   */
  createOrUpdateTodo(todo) {
    const {task, id} = todo;

    return models.Todo.upsert(
      {id, task},
      {where: {id}
    }).then(todo => todo);
  },

  /**
   * deleteTodo
   * @desc Deletes todo from database.
   * @type {Function}
   * @param {Number} id - todo ID
   * @return {Promise}
   */
  deleteTodo(id) {
    return models.Todo.destroy({
      where: {id}
    }).then(() => id);
  },
};

module.exports = TodoActions;
