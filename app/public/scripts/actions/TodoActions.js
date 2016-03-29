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
 * @desc Enum containing actions for todo items.
 * Rx.Subject represents an object that is both an observable and observer.
 * @type {Object}
 */
export const TodoActions = {
  /**
   * createTodo$
   * @desc Creates a local todo.
   * @type {Observable}
   */
  createTodo$: new Rx.Subject(),

  /**
   * deleteTodo$
   * @desc Marks local todo for deletion.
   * @type {Observable}
   */
  deleteTodo$: new Rx.Subject(),

  /**
   * updateTodo$
   * @desc Updates local todo value.
   * @type {Observable}
   */
  updateTodo$: new Rx.Subject(),

  /**
   * loadTodo$
   * @desc Loads a local todo when todo ID is known.
   * @type {Observable}
   */
  loadTodo$: new Rx.Subject(),

  /**
   * fetchTodos$
   * @desc Fetches todos from server.
   * @type {Observable}
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
   * saveTodos$
   * @desc Saves todos to server.
   * @type {Observable}
   */
  saveTodos$: new Rx.Subject()
};

  /**
   * TodoActions.register
   * @desc Register
   * @type {Function}
   * @param {Function} updates
   */
TodoActions.register = function (updates) {
  /**
   * @desc Add new todo to todos.
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
        const index = todos.indexOf(todo);
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

  //this.saveTodos$.
};
