'use strict';

import {h} from 'yolk';
import Rx from 'rx';

import {TodoActions} from './actions/TodoActions';

/**
 * Header
 * @desc View containing the header.
 * @type {Function}
 */
export function Header({createEventHandler}) {
  const handleSubmit$ = createEventHandler(event => event.preventDefault())
  const handleChange$ = createEventHandler(event => event.target.value);
  const displayValue$ = new Rx.BehaviorSubject('');

  handleSubmit$
  // Merge observable sequences into one.
  .withLatestFrom(displayValue$, (handleSubmit, displayValue) => displayValue)
  // Trim values.
  .map(value => value.trim())
  // Filter non-empty values.
  .filter(value => !!value.length)
  // Create todo.
  .subscribe(TodoActions.createTodo$);

  // Update display value when there is an input change.
  handleChange$.subscribe(displayValue$);
  // Empty display value after form submit.
  handleSubmit$.map(() => '').subscribe(displayValue$);

  return (
    <header className="ui header row">
      <h1 className="ui"><i className="icon list layout"></i> Todos</h1>
      <form onSubmit={handleSubmit$} className="ui">
        <div className="ui action fluid input">
          <input placeholder="What to do?" autoFocus={true} onChange={handleChange$} value={displayValue$} />
          <button onClick={handleSubmit$} type="submit" className="ui green button">
            <i className="icon add circle"></i> Add
          </button>
        </div>
      </form>
    </header>
  );
}
