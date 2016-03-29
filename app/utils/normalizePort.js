'use strict';

/**
 * normalizePort
 * @desc Normalize a port into a number, string, or false.
 * @param {String|Number} value - value to normalize
 * @type {Function}
 * @return {Number} normalized port number
 */
function normalizePort(value) {
  const port = parseInt(value, 10);

  if (isNaN(port) || port < 0) {
    throw new TypeError(`Port number \`${value}\` could not be normalized.`);
  }

  return port;
}

module.exports = normalizePort;
