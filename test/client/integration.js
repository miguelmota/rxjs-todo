'use strict';

const assert = require('chai').assert;

/**
* @test Integration Tests
*/
describe('Todo Integration Tests', () => {
  const taskName = 'Foo';
  const edittedTaskName = 'Foobar';

  it('Fills out input and clicks add button', (done) => {
    const $input = $('header form input', document);
    const $addTodoButton = $('header button[type="submit"]', document);

    $input.val(taskName);

    triggerInputChange($input[0]);

    assert.equal($input.val(), taskName);
    $addTodoButton.click();
    done();
  });

  it('List contains new todo item', (done) => {
    const $input = $('header form input', document);
    const $items = $('.segments .segment', document);
    const $item = $items.find('.label input').eq(0);

    assert.equal($items.length, 1);
    assert.equal($input.val(), '');
    assert.equal($item.val(), taskName);
    done();
  });

  it('Edit todo', (done) => {
    const $items = $('.segments .segment', document);
    const $editButton = $items.find('.label button').eq(0);
    const $doneButton = $items.find('.edit button').eq(0);
    const $input = $items.find('.edit input').eq(0);

    assert.equal($input.val(), taskName);

    $editButton.click();
    $input.val(edittedTaskName);

    triggerInputChange($input[0]);

    $doneButton.click();
    const $item = $items.find('.label input').eq(0);

    assert.equal($item.val(), edittedTaskName);
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

function triggerInputChange(inputElement) {
  // Trigger `input` change event.
  const event = document.createEvent('HTMLEvents');
  event.initEvent('input', false, true);
  inputElement.dispatchEvent(event);
}
