'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const routes = require('./routes/index');
const todos = require('./routes/todos');

/**
 * @desc View engine setup.
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * @desc Public directory setup.
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * @desc Enable logging on development environment.
 */
app.use(logger('dev'));

/**
 * @desc Enable logging on development environment.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * @desc Enable Cross origin resource sharing.
 */
app.use(cors());

/**
 * @desc Set up base routes.
 */
app.use('/', routes);
app.use('/api/todos', todos);

/**
 * @desc Catch 404 and forward to error handler.
 */
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * @desc Development error handler.
 * Will print stacktrace.
 */
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

/**
 * @desc Production error handler.
 * No stacktraces leaked to user.
 */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
