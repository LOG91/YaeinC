import { combineReducers } from 'redux';
import checker from './checker';
import inserted from './inserted';
import signin from './signin';

export default combineReducers({
  checker, inserted,signin
});