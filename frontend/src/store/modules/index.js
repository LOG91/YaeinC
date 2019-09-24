import { combineReducers } from 'redux';
import checker from './checker';
import registerer from './registerer';
import watcher from './watcher';

export default combineReducers({
  checker,
  registerer,
  watcher
})