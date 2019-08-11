import { handleActions } from 'redux-actions';
import NAMESPACE from './constants';

const initState = {
  messageList: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  status: 'more'
}
const messageReducers = handleActions({
  [`${NAMESPACE}/save`]: (state, { payload = {} }) => ({
    ...state,
    ...payload
  })
}, initState)

export default messageReducers;
