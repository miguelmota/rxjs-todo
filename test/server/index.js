'use strict';

const test = require('tape');
const request = require('supertest');
const async = require('async');

const app = require('../../app/app');

test('Server', (t) => {
  t.plan(11);

  const todos = [1,2].map(generateTodo);

  async.series([
    /**
     * @desc Test index route.
     */
    (callback) => {
      request(app)
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200)
      .end((error, response) => {
        t.notOk(error);
        t.ok(response.body);
        callback()
      });
    },

    /**
     * @desc Test todos GET.
     */
    (callback) => {
      request(app)
      .get('/api/todos')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((error, response) => {
        t.notOk(error);
        t.ok(Array.isArray(response.body.data.todos));
        callback();
      });
    },

    /**
     * @desc Test todos POST.
     */
    (callback) => {
      request(app)
      .post('/api/todos')
      .set('Content-type', 'application/json')
      .send({
        todos: todos
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((error, response) => {
        t.notOk(error);
        t.ok(Array.isArray(response.body.data.todos));
        t.equal(response.body.data.todos.length, todos.length);
        callback();
      });
    },

    /**
     * @desc Test todos GET.
     */
    (callback) => {
      /**
       * @desc Test todos DELETE.
       */
      request(app)
      .delete('/api/todos')
      .set('Content-type', 'application/json')
      .send({
        todos: todos.map(todo => todo.id)
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((error, response) => {
        t.notOk(error);
        t.ok(Array.isArray(response.body.data.todos));
        t.equal(response.body.data.todos.length, todos.length);
        callback();
      });
    }
  ], (error, result) => {
    t.notOk(error);
  });

});

function generateId() {
  return ((Math.random() * 1e9) >>> 0);
}

function generateString() {
  return Math.random().toString(36).slice(-10);
}

function generateTodo() {
  return {
    task: generateString(),
    id: generateId()
  };
}
