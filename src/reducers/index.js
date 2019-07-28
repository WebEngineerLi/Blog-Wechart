import { combineReducers } from 'redux'
import counter from './counter'
import { reducers as BlogReducers, namespace as blogNamespace } from '../model/blog'

export default combineReducers({
  counter,
  [blogNamespace]: BlogReducers
})
