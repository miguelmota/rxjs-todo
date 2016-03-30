'use strict';

/**
 * Models
 * @namespace server/models
 */

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env] || {};

const dialect = config.dialect || 'postgres';
const host = config.host || process.env.POSTGRES_HOST || '127.0.0.1';
const port = config.port || process.env.POSTGRES_PORT || 5432;
const database = config.database || process.env.POSTGRES_DB || 'test';

const username = config.username || process.env.POSTGRES_USER || 'root';
const password = config.password || process.env.POSTGRES_PASSWORD || null;

const sequelize = new Sequelize(`${dialect}://${username}:${password}@${host}:${port}/${database}`);
const db = {};

const model = sequelize.import(path.join(__dirname, 'todo.js'));

/**
 * db
 * @desc Object containing all the Sequelize models.
 * @type {Object}
 * @memberof server/models
 */
db[model.name] = model;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
