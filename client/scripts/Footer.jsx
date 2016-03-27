'use strict';

import {h} from 'yolk';
import Rx from 'rx';
import RxDOM from 'rx-dom';

/**
 * Footer
 * @desc View containing the footer.
 * @type {Function}
 */
export function Footer({props, createEventHandler}) {
  const {todos} = props;
  const handleSave$ = createEventHandler();

  handleSave$
  .withLatestFrom(todos, (handleDave, todos) => {
    return todos.valueSeq().toArray().map(map => map.toObject());
  })
  .subscribe(todos => {
    const baseUrl = 'http://localhost:8080/';
    const resource = 'todos';
    const url = `${baseUrl}${resource}`

    console.log(todos);
    const toSaveTodos = todos.filter(todo => !todo.willDelete);
    const toDeleteTodoIds = todos.filter(todo => todo.willDelete).map(todo => todo.id);

    Rx.DOM.post({
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json',
      body: JSON.stringify({todos: toSaveTodos})
    })
    .subscribe(xhr => {
      const {response} = xhr;
      console.log('DATA', response);

      if (response.error) {
        console.error(response.error);
      } else {

      }
    });

    Rx.DOM.ajax({
      method: 'delete',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json',
      body: JSON.stringify({todos: toDeleteTodoIds})
    })
    .subscribe(xhr => {
      const {response} = xhr;
      console.log('DATA', response);

      if (response.error) {
        console.error(response.error);
      } else {

      }
    });
  });

  return (
    <footer>
      <button onClick={handleSave$}>Save</button>
    </footer>
  );
}
