'use strict';

/**
 * generateId
 * @desc Generates a random ID
 * @type {Function}
 * @return {Number} - randomly geneated ID
 * @memberof client/utils
 */
export function generateId() {
  return ((Math.random() * 1e9) >>> 0);
}
