'use strict';

import Immutable from 'immutable';

import {generateId} from './generateId'

/**
 * createTodo
 * @desc Creates a todo Map from a task value.
 * @type {Function}
 * @param {String} task - task value
 * @return {Map} - immutable Map
 */
export function createTodo(task) {
  return Immutable.fromJS({
    id: generateId(),
    task,
    willDelete: false
  });
}

/**
 * createTodoFromObject
 * @desc Creates a todo Map from a todo object.
 * @type {Function}
 * @param {Object} todo - todo object
 * @param {String} todo.task - task value
 * @param {Number} todo.id - task ID
 * @param {Boolean} todo.willDelete - deletion flag
 * @return {Map} - immutable Map
 */
export function createTodoFromObject(todo) {
  const {id, task, willDelete} = todo;

  return Immutable.fromJS({
    id,
    task,
    willDelete: !!willDelete
  });
}
