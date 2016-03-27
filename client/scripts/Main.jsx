'use strict';

import {h} from 'yolk';

import {TodoList} from './TodoList.jsx';

/**
 * Main
 * @desc View containing the main content.
 * @type {Function}
 */
export function Main({props}) {
  const {todos} = props;

  return (
    <main>
      <TodoList todos={todos} />
    </main>
  );
}
