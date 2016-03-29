'use strict';

import {h} from 'yolk';
import Rx from 'rx';

import {Actions} from './Actions';
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

  Actions.fetchTodos$.forEach(todo$ => todo$.subscribe(t$=> t$.subscribe(Actions.loadTodo$)));

  return (
    <div className="ui container">
      <Header />
      <Main todos={todos} />
      <Footer todos={todos} />
    </div>
  );
}
