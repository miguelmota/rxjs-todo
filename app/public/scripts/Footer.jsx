'use strict';

import {h} from 'yolk';
import Rx from 'rx';
import RxDOM from 'rx-dom';

import {API_Endpoints} from './constants/ApiEndpoints';
import {TodoActions} from './actions/TodoActions';

/**
 * Footer
 * @desc View containing the footer.
 * @type {Function}
 */
export function Footer({props, createEventHandler}) {
  const {todos} = props;
  const handleSave$ = createEventHandler();
  const isSaving$ = new Rx.BehaviorSubject(false);

  handleSave$
  .withLatestFrom(todos, (handleDave, todos) => {
    return todos.valueSeq().toArray().map(map => map.toObject());
  })
  .subscribe(todos => {
    console.log(todos);
    const toSaveTodos = todos.filter(todo => !todo.willDelete);
    const toDeleteTodoIds = todos.filter(todo => todo.willDelete).map(todo => todo.id);

    // Make ajax calls to save and delete todos.
    TodoActions.saveTodos$(toSaveTodos)
    .merge(TodoActions.deleteTodos$(toDeleteTodoIds))
    .subscribe(xhr => {
      const {response} = xhr;

      isSaving$.onNext(false);

      if (response.error) {
        console.error(response.error);
      }
    });
  });

  // Set loading state when saving.
  handleSave$
  .map(() => true)
  .subscribe(isSaving$);

  const classNames = [
    isSaving$.map(ok => ok ? `loading` : ``),
    'ui',
    'primary',
    'large',
    'button'
  ];

  return (
    <footer className="ui row">
      <button onClick={handleSave$} className={classNames}><i className="icon save"></i> Save</button>
    </footer>
  );
}
