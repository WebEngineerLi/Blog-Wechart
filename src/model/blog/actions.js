/* eslint-disable */
import * as services from './services';
import NAMESPACE from './constants';

function listBlog (params) {
  return async (dispatch) => {
    const res = await services.listBlog('get', params)
    const { data: { data } } = res;
    dispatch({
      type: `${NAMESPACE}/save`,
      payload: {
        blogList: data
      }
    })
  }
}
function blogDetail(params, callback) {
  return async (dispatch) => {
    const res = await services.blogDetail('get', params)
    const { data: { data } } = res;
    dispatch({
      type: `${NAMESPACE}/save`,
      payload: {
        blogDetail: data[0]
      }
    })
    callback && callback(data[0])
  }
}

export { listBlog, blogDetail }