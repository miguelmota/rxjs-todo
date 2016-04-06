'use strict';

const hostname = (typeof window === 'object' ? window.location.hostname : 'localhost');

/**
 * API_BASE_URL
 * @type {String}
 * @memberof client/constants
 */
export const API_BASE_URL = `http://${hostname}:8080/api`;

/**
 * API_ENPOINTS
 * @desc Enum containing API endpoints.
 * @type {Object}
 * @memberof client/constants
 */
export const API_Endpoints = {
  TODOS: `${API_BASE_URL}/todos`
};
