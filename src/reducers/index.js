import { combineReducers } from 'redux'
import { reducers as BlogReducers, namespace as blogNamespace } from '../model/blog'

export default combineReducers({
  [blogNamespace]: BlogReducers
})
