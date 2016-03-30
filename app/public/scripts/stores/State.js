'use strict';

import Rx from 'rx';
import Immutable from 'immutable';

/**
 * KeyConstants
 * @desc Contains keys for state object.
 * @type {Object}
 */
export const KeyConstants = {
  TODOS: 'todos'
}

/**
 * State
 * @desc Store which expose 2 streams.
 * @type {Function}
 */
export function State() {
  /**
   * @desc Initial state object.
   * @type {Object}
   */
  const initial = {
    [KeyConstants.TODOS]: []
  };

  /**
   * @desc `updates` property is a BehaviorSubject which
   * represents a value the changes over time.
   * It receives operations to be applied on the todos list.
   */
  this.updates = new Rx.BehaviorSubject(Immutable.fromJS(initial));

  /**
   * @desc `asObservable` property is an observable sequence that shares a single subscription.
   * `scan` is like reduce, but returns each intermediate result on each `onNext` call.
   */
  this.asObservable = this.updates.scan((state, operation) => operation(state)).shareReplay(1);
}
