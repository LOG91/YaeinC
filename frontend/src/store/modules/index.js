import { combineReducers } from 'redux';
import checker from './checker';
import inserted from './inserted';
import signin from './signin';
import emptyCheck from './emptyCheck';

export default combineReducers({
  checker, inserted, signin, emptyCheck
});