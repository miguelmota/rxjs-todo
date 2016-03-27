'use strict';

import {h} from 'yolk';
import Rx from 'rx';

import {Actions} from './Actions';

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
  .subscribe(Actions.createTodo$);

  // Update display value when there is an input change.
  handleChange$.subscribe(displayValue$);
  // Empty display value after form submit.
  handleSubmit$.map(() => '').subscribe(displayValue$);

  return (
    <header>
      <h1>Yolk Todo App</h1>
      <form onSubmit={handleSubmit$}>
        <input placeholder="Enter todo..." autoFocus={true} onChange={handleChange$} value={displayValue$} />
        <button onClick={handleSubmit$} type="submit">Add</button>
      </form>
    </header>
  );
}
