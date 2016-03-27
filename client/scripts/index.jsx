'use strict';

import {h, render} from 'yolk';

import {Actions} from './Actions';
import {State} from './State';
import {App} from './App.jsx';

const state = new State();
Actions.register(state.updates);

render(<App state={state.asObservable} />, document.getElementById('app'));
