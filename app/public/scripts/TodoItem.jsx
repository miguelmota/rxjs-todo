'use strict';

import {h} from 'yolk';
import Rx from 'rx';

import {TodoActions} from './actions/TodoActions';

/**
 * TodoItem
 * @desc View containing the todo item.
 * @type {Function}
 * @memberof client/views
 */
export function TodoItem({props, createEventHandler}) {
  const {todo} = props;
  const task = todo.map(t => t.get('task'))
  const isEditing$ = new Rx.BehaviorSubject(false);
  const handleDelete$ = createEventHandler();
  const handleEdit$ = createEventHandler();
  const handleSubmit$ = createEventHandler();
  const handleInputChange$ = createEventHandler(event => event.target.value);

  // Mark todo item for deletion on delete button click.
  handleDelete$
  .withLatestFrom(todo, (handleDelete, todo) => todo)
  .subscribe(TodoActions.deleteTodo$);

  // Set editting flat to true on edit button click.
  handleEdit$
  .map(() => true)
  .subscribe(isEditing$);

  // Update todo item on edit save.
  handleSubmit$
  .tap(() => isEditing$.onNext(false))
  .withLatestFrom(todo, handleInputChange$, (handleEdit, todo, newValue) => [todo, newValue])
  .subscribe(value => {
    return TodoActions.updateTodo$.onNext(value);
  });

  // Set class names for when in editing state.
  const classNames = [
    isEditing$.map(ok => ok ? `editing` : ``),
    'ui',
    'segment'
  ];

  return (
    <div className={classNames}>
      <section className="edit">
        <div className="ui action fluid input">
          <input type="text" onInput={handleInputChange$} value={task} />
          <button type="submit" onClick={handleSubmit$} className="ui primary button">
            <i className="icon check circle"></i> Done
          </button>
        </div>
      </section>
      <section className="label">
        <div className="ui fluid input">
          <input type="text" value={task} />
          <div className="ui icon basic buttons">
            <button onClick={handleEdit$} className="left attached ui button">
              <i className="icon edit"></i> Edit
            </button>
            <button onClick={handleDelete$} className="right attached ui button" aria={{label: 'delete'}}>
              <i className="icon remove circle"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
