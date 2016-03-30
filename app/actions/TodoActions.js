'use strict';

const models = require('../models');

/**
 * TodoActions
 * @desc Contains todo actions.
 * @namespace server/actions/TodoActions
 * @type {Object}
 */
const TodoActions = {
  /**
   * @method getTodos
   * @desc Returns todos from database.
   * @type {Function}
   * @return {Promise}
   * @memberof server/actions/TodoActions
   */
  getTodos() {
    return models.Todo.findAll()
    .then(todos => {
      return todos.map(({task, id}) => ({task, id}));
    });
  },

  /**
   * @method createOrUpdateTodo
   * @desc Creates a new todo, or updates the todo if
   * it already exists based on ID.
   * @type {Function}
   * @param {Object} todo - todo object
   * @param {String} todo.task - todo task value
   * @param {Number} [todo.id] - todo id
   * @return {Promise}
   * @memberof server/actions/TodoActions
   */
  createOrUpdateTodo(todo) {
    const {task, id} = todo;

    return models.Todo.upsert(
      {id, task},
      {where: {id}
    }).then(todo => todo);
  },

  /**
   * @method deleteTodo
   * @desc Deletes todo from database.
   * @type {Function}
   * @param {Number} id - todo ID
   * @return {Promise}
   * @memberof server/actions/TodoActions
   */
  deleteTodo(id) {
    return models.Todo.destroy({
      where: {id}
    }).then(() => id);
  },
};

module.exports = TodoActions;
