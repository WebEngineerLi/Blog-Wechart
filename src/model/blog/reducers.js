import { handleActions } from 'redux-actions';
import NAMESPACE from './constants';

const initState = {
  blogList: [],
  blogDetail: {}
}
const blogReducers = handleActions({
  [`${NAMESPACE}/save`]: (state, { payload = {} }) => ({
    ...state,
    ...payload
  })
}, initState)

export default blogReducers;
