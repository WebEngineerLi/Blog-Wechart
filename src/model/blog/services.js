/* eslint-disable */

import baseUrl from '../../utils/baseUrl';
import request from '../../utils/request';

const listBlog = (method, params) => request(`${baseUrl}/service/blog/all`, method, params);

const blogDetail = (method, params) => request(`${baseUrl}/service/blog/detail`, method, params);

export { listBlog, blogDetail }