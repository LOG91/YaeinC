import { combineReducers } from 'redux';
import checker from './checker';
import inserted from './inserted';

export default combineReducers({
  checker, inserted
})