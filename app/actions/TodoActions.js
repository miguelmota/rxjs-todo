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
};

module.exports = TodoActions;
