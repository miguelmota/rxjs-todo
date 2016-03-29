'use strict';

import {h, render} from 'yolk';

import {TodoActions} from './actions/TodoActions';
import {State} from './stores/State';
import {App} from './App.jsx';

const state = new State();
TodoActions.register(state.updates);

render(<App state={state.asObservable} />, document.getElementById('app'));
