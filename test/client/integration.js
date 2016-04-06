'use strict';

const assert = require('chai').assert;

/**
* @test Integration Tests
*/
describe('Todo Integration Tests', () => {
  const taskName = 'Foo';

  it('Fills out input and clicks add button', (done) => {
    const $input = $('header form input', document);
    const $addTodoButton = $('header button[type="submit"]', document);
    const event = document.createEvent('HTMLEvents');
    event.initEvent('input', false, true);

    $input.val(taskName);
    $input[0].dispatchEvent(event)

    assert.equal($input.val(), taskName);
    $addTodoButton.click();
    done();
  });

  it('List contains new todo item', (done) => {
    const $input = $('header form input', document);
    const $items = $('.segments .segment', document);
    const $item = $items.find('input').eq(0);

    assert.equal($items.length, 1);
    assert.equal($input.val(), '');
    assert.equal($item.val(), taskName);
    done();
  });

  it('Delete todo', (done) => {
    const $items = $('.segments .segment', document).eq(0);
    const $deleteButton = $items.find('.label button').eq(1);

    assert.equal($items.length, 1);
    $deleteButton.click();

    const $newItems = $('.segments .segment', document);

    assert.equal($newItems.length, 0);
    done();
  });
});
