import { combineReducers } from 'redux'
import { reducers as BlogReducers, namespace as blogNamespace } from '../model/blog'
import { reducers as MessageReducers, namespace as messageNamespace } from '../model/message'

export default combineReducers({
  [blogNamespace]: BlogReducers,
  [messageNamespace]: MessageReducers
})
