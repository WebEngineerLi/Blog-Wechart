import Taro from '@tarojs/taro'

const request = (url, method, params) => {
  const baseConfig = {
    header: {
      'content-type': 'application/json'
    }
  }
  const config = {
    url,
    method,
    data: params,
    ...baseConfig
  }
  return Taro.request(config).then(res => {
    return res;
  })
}

export default request;