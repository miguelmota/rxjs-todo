'use strict';

import {h} from 'yolk';

import {TodoItem} from './TodoItem.jsx';

/**
 * TodoList
 * @desc View containing the todo list.
 * @type {Function}
 * @memberof client/views
 */
export function TodoList({props}) {
  const {todos} = props;

  const todoItems = todos.map(list => list.filter(
      // Filter out todo items marked for deletion.
      todo => !todo.get('willDelete'))
      // Create todo item view.
      .map(todo => <TodoItem todo={todo} key={todo.get('id')} />));

  return (
    <div className="ui segments row">
      {todoItems}
    </div>
  );
}
