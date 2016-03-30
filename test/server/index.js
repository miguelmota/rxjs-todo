'use strict';

const test = require('tape');
const request = require('supertest');

const app = require('../../app/app');

function generateId() {
  return ((Math.random() * 1e9) >>> 0);
}

function generateTodo() {
  return {
    task: generateId(),
    id: generateId()
  };
}

test('Server', (t) => {
  t.plan(2);

  /**
   * @desc Test index route.
   */
  request(app)
  .get('/')
  .expect('Content-Type', /text\/html/)
  .expect(200)
  .end((error, response) => {
    t.notOk(error);
    t.ok(response.body);
  });
});

test('API', (t) => {
  t.plan(4);

  const todos = [generateTodo()];

  /**
   * @desc Test todos POST.
   */
  request(app)
  .post('/api/todos')
  .set('Content-type', 'application/json')
  .send({
    todos: todos
  })
  .expect('Content-Type', /json/)
  .expect(200)
  .end((error, response) => {
    console.log(response.body)
    t.notOk(error);
    t.ok(Array.isArray(response.body.data.todos));
  });

  /**
   * @desc Test todos GET.
   */
  request(app)
  .get('/api/todos')
  .expect('Content-Type', /json/)
  .expect(200)
  .end((error, response) => {
    t.notOk(error);
    t.ok(Array.isArray(response.body.data.todos));
  });
});
