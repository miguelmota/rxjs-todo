'use strict';

import {h} from 'yolk';
import Rx from 'rx';

import {Actions} from './Actions';

/**
 * TodoItem
 * @desc View containing the todo item.
 * @type {Function}
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
  .subscribe(Actions.deleteTodo$);

  // Set class names for when in editing state.
  const classNames = [
    isEditing$.map(bool => bool ? `editing` : ``),
  ];

  // Set editting flat to true on edit button click.
  handleEdit$
  .map(() => true)
  .subscribe(isEditing$);

  // Update todo item on edit save.
  handleSubmit$
  .withLatestFrom(todo, handleInputChange$, (handleEdit, todo, newValue) => [todo, newValue])
  .subscribe(value => {
    isEditing$.onNext(false);
    return Actions.updateTodo$.onNext(value);
  })

  return (
    <li className={classNames}>
      <div className="edit">
        <input type="text" onChange={handleInputChange$} value={task} />
        <button type="submit" onClick={handleSubmit$}>Done</button>
      </div>
      <div className="label">
        {task}
        <button onClick={handleDelete$}>Delete</button>
        <button onClick={handleEdit$}>Edit</button>
      </div>
    </li>
  );
}
