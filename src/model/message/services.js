/* eslint-disable */

import baseUrl from '../../utils/baseUrl';
import request from '../../utils/request';

export const getMessageList = (method, params) => request(`${baseUrl}/service/messages/list`, method, params);

// export const login = (method, params) => request(`https://api.weixin.qq.com/sns/jscode2session?appid=${params.appid}&secret=${params.secret}&js_code=${params.jsCode}&grant_type=authorization_code`, method, {})
export const login = (method, params) => request(`${baseUrl}/service/login/wechart`, method, params)

export const register = (method, params) => request(`${baseUrl}/service/user/register`, method, params)

export const checkUniq = (method, params) => request(`${baseUrl}/service/user/checkUniq`, method, params)

export const postMessage = (method, params) => request(`${baseUrl}/service/messages/post`, method, params)

export const deleteMessage = (method, params) => request(`${baseUrl}/service/messages/delete`, method, params)