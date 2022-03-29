import request from '@/utils/request'

// 获取验证码
export function verificationCode() {
  return request({
    baseURL: 'BASE_API',
    url: '/auth/verificationcode',
    method: 'post'
  })
}

// 登录校验
export function loginByUsername(data) {
  delete data.password_original
  return request({
    baseURL: 'BASE_API',
    url: '/auth/login',
    method: 'post',
    custom: { 'needToken': false },
    data
  })
}
// 退出登录
export function logout() {
  return request({
    baseURL: 'BASE_API',
    url: '/auth/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    baseURL: 'BASE_API',
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

// 检查角色
export function checkRole(data) {
  return request({
    baseURL: 'BASE_API',
    url: '/auth/checkRole',
    method: 'post',
    custom: { 'needToken': false },
    data: data,
    transformRequest: [function(data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 获取科室树
 */
export function getDeptTree(custid) {
  const custom = JSON.stringify({ 'custid': custid })
  return request({
    baseURL: 'BASE_API',
    url: '/jcyw/depts/tree',
    method: 'get',
    headers: {
      custom
    }
  })
}

/**
 * 提交注册
 * @param data
 */
export function register(data) {
  return request({
    baseURL: 'BASE_API',
    url: '/jcyw/user/register',
    method: 'post',
    data
  })
}
/**
 * 获取机构
 */

/**
 * 获取机构列表（分页）
 * @param params 查询条件
 * @param pagenumber 页码
 * @param pagesize 每页条数
 */
export function findOrgsList(params, pagenumber, pagesize) {
  return request({
    baseURL: 'BASE_API',
    url: '/org/page?' + (params || ''),
    method: 'get',
    params: { pagenumber, pagesize },
    custom: { 'needToken': false }
  })
}

// 根据用户ID和角色ID获取树
export function getResourceTreeByUserAndRole(params) {
  return request({
    baseURL: 'BASE_API',
    url: '/jcyw/user/resources/tree',
    method: 'get',
    params: params
  })
}

