'use strict';

import Rx from 'rx';
import Immutable from 'immutable';
import RxDOM from 'rx-dom';

import {KeyConstants} from '../stores/State';
import {createTodo, createTodoFromObject} from '../utils/createTodo';
import {isTodoUnique} from '../utils/isTodoUnique';
import {API_Endpoints} from '../constants/ApiEndpoints';

/**
 * TodoActions
 * @desc Object containing actions for todo items.
 * Rx.Subject represents an object that is both an observable and observer.
 * @namespace client/actions/TodoActions
 * @type {Object}
 */
export const TodoActions = {
  /**
   * @method createTodo$
   * @desc Creates a local todo.
   * @type {Observable}
   * @memberof client/actions/TodoActions
   */
  createTodo$: new Rx.Subject(),

  /**
   * @method deleteTodo$
   * @desc Marks local todo for deletion.
   * @type {Observable}
   * @memberof client/actions/TodoActions
   */
  deleteTodo$: new Rx.Subject(),

  /**
   * @method updateTodo$
   * @desc Updates local todo value.
   * @type {Observable}
   * @memberof client/actions/TodoActions
   */
  updateTodo$: new Rx.Subject(),

  /**
   * @method loadTodo$
   * @desc Loads a local todo when todo ID is known.
   * @type {Observable}
   * @memberof client/actions/TodoActions
   */
  loadTodo$: new Rx.Subject(),

  /**
   * @method fetchTodos$
   * @desc Fetches todos from server.
   * @type {Observable}
   * @memberof client/actions/TodoActions
   */
  fetchTodos$: Rx.Observable.create((observable) => {
    Rx.DOM.get({
      url: API_Endpoints.TODOS,
      responseType: 'json'
    })
    .subscribe(xhr => {
      const {response} = xhr;
      const {error} = response;
      const {todos} = response.data;

      if (error) {
        console.error(error);
        observable.onError(error);
      }

      const todos$ = Rx.Observable.fromArray(todos)
       .map(todo => new Rx.BehaviorSubject(todo));

       observable.onNext(todos$);
    });
  }),

  /**
   * @method saveTodos$
   * @desc Saves todos to server.
   * @type {Function}
   * @param {Array} todos - list of todos
   * @return {Observable}
   * @memberof client/actions/TodoActions
   */
  saveTodos$: (todos) => {
    return Rx.DOM.post({
      url: API_Endpoints.TODOS,
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json',
      body: JSON.stringify({todos: todos})
    });
  },

  /**
   * @method deleteTodos$
   * @desc Deletes todos from server.
   * @type {Function}
   * @param {Array} todoIds - list of todos IDs
   * @return {Observable}
   * @memberof client/actions/TodoActions
   */
  deleteTodos$: (todoIds) => {
    return Rx.DOM.ajax({
      method: 'DELETE',
      url: API_Endpoints.TODOS,
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json',
      body: JSON.stringify({todos: todoIds})
    });
  }
};

/**
 * @method register
 * @desc Takes in an observer that gets with an action.
 * @type {Observer}
 * @param {Function} updates - Observer
 * @memberof client/actions/TodoActions
 */
TodoActions.register = function(updates) {
  /**
   * @desc Add new todo to todos list.
   */
  this.createTodo$
  .map(task => {
    const todo = createTodo(task);
    return state => {
      const todos = state.get(KeyConstants.TODOS);
      const isUnique = isTodoUnique(todos, task);

      if (isUnique) {
        return state.update(KeyConstants.TODOS, todos => todos.unshift(todo));
      } else {
        // temporary, need to return error
        alert('Item already exists.');
        return state;
      }
    };
  })
  .subscribe(updates);

  /**
   * @desc Mark todo for deletion.
   */
  this.deleteTodo$
  .map(todo => {
    return state => {
      return state.update(KeyConstants.TODOS, todos => {
        let index = todos.indexOf(todo);

        if (typeof todo === 'string') {
          index = todos.findIndex(item => {
            return item.get('task') === todo;
          });
        }

        return todos.update(index, (todo) => todo.set('willDelete', true));

      });
    };
  })
  .subscribe(updates);

  /**
   * @desc Update todo value.
   */
  this.updateTodo$
  .map(([todo, task]) => {
    return state => {
      return state.update(KeyConstants.TODOS, todos => {
        const index = todos.indexOf(todo);
        return todos.set(index, todo.set('task', task))
      })
    };
  })
  .subscribe(updates);

  /**
   * @desc Add existing todo to todos list.
   */
  this.loadTodo$
  .map(task => {
    const todo = createTodoFromObject(task);
    return state => {
      const todos = state.get(KeyConstants.TODOS);
      return state.update(KeyConstants.TODOS, todos => todos.unshift(todo));
    };
  })
  .subscribe(updates);
};
