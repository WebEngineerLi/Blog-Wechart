/* eslint-disable */
import * as services from './services';
import * as selectors from './selectors';
import NAMESPACE from './constants';

export function getMessageList (params) {
  return async (dispatch, getState) => {
    const state = getState();
    const { current: pageNo, pageSize } = selectors.getPagination(state);
    const newParams = {
      ...params,
      pageNo,
      pageSize
    }
    const res = await services.getMessageList('get', newParams)
    const { data: { data, total } } = res;
    dispatch({
      type: `${NAMESPACE}/save`,
      payload: {
        messageList: data,
        pagination: {
          current: pageNo,
          pageSize,
          total
        },
        status: pageSize < total ? 'more': 'noMore'
      }
    })
  }
}
export function dump(params) {
  return (dispatch) => {
    dispatch({
      type: `${NAMESPACE}/save`,
      payload: params,
    })
  }
}
export function login(params, callback) {
  return async () => {
    const res = await services.login('get', params)
    callback(res);
  }
}

export function register(params) {
  return async () => {
    const res = await services.register('post', params)
    console.log('res:', res);
  }
}