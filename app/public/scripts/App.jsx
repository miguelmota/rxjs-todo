'use strict';

import {h} from 'yolk';
import Rx from 'rx';

import {TodoActions} from './actions/TodoActions';
import {Header} from './Header.jsx';
import {Main} from './Main.jsx';
import {Footer} from './Footer.jsx';

/**
 * App
 * @desc View containing the application.
 * @type {Function}
 */
export function App({props, createEventHandler}) {
  const {state} = props;
  const todos = state.map(s => s.get(`todos`));

  // Fetch todos and add them to the list.
  TodoActions.fetchTodos$.forEach(todo$ => todo$.subscribe(
    t$ => t$.subscribe(TodoActions.loadTodo$))
  );

  return (
    <div className="ui container">
      <Header />
      <Main todos={todos} />
      <Footer todos={todos} />
    </div>
  );
}
