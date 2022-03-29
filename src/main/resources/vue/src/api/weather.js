import request from '@/utils/request'

/**
 * 上传文件
 */
export function uploadFile(url, data) {
  return request({
    url,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
/**
 * post请求
 * @param uri 接口地址
 * @param data 数据内容
 * @returns {*}
 */
export function httpPost(uri, data){
  return request({
    url: uri,
    method: 'post',
    data
  })
}

/**
 * get 请求
 * @param uri 接口地址
 * @param data 数据内容
 * @returns {*}
 */
export function httpGet(uri, data) {
  return request({
    url: uri,
    method: 'get',
    data
  })
}

