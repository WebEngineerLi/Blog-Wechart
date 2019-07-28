/* eslint-disable */

import baseUrl from '../../utils/baseUrl';
import request from '../../utils/request';

const listBlog = (method, params) => request(`${baseUrl}/service/blog/all`, method, params);

export { listBlog }