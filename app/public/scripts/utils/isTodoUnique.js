/**
 * isTodoUnique
 * @desc Checks if a todo is unique from todos list.
 * @type {Function}
 * @param {Array} todos - todos list
 * @param {String} task - task value
 * @return {Boolean}
 * @memberof client/utils
 */
export function isTodoUnique(todos, task) {
  const tasks = todos.valueSeq().toArray();
  return tasks.every(item => item.get('willDelete') || item.get('task') !== task);
}
