'use strict';

import test from 'tape';
import Rx from 'rx';
import {TodoActions} from '../../app/public/scripts/actions/TodoActions';
import {State} from '../../app/public/scripts/stores/State';

const state = new State();
TodoActions.register(state.updates);

test('Todo Actions', (t) => {
  t.plan(12);

  const tasks = ['foo','bar','baz'];

  let iteration = 0;
  let count = 0;

  state.asObservable
  .subscribe(state => {
    const todos = state.get('todos');

    if (iteration > 0 && iteration <= 3) {
      t.equal(todos.count(), count);
      t.equal(todos.first().get('task'), tasks[count - 1]);
    } else if (iteration > 3) {
      t.equal(todos.filter(todo => todo.get('willDelete')).count(), count);
      t.equal(todos.filter(todo => todo.get('willDelete')).first().get('task'), tasks[count - 1]);
    }
  });

  loopTasks(task => {
    new Rx.BehaviorSubject(task)
    .subscribe(TodoActions.createTodo$);
  });

  loopTasks(task => {
    new Rx.BehaviorSubject(task)
    .subscribe(TodoActions.deleteTodo$);
  });

  function loopTasks(callback) {
    count = 0;

    tasks.forEach(t => {
      iteration++; count++;
      callback(t)
    });
  }
});

