/**
 * isTodoUnique
 * @desc Checks if a todo is unique from todos list.
 * @type {Function}
 * @param {Array} todos - todos list
 * @param {String} task - task value
 * @return {Boolean}
 */
export function isTodoUnique(todos, task) {
  const tasks = todos.valueSeq().toArray();
  return tasks.every(map => map.get('task') !== task);
}
