import request from '@/utils/request'

// 根据用户 ID 获取拥有权限的资源树
export function getResourceTreeByUserId(userid) {
  return request({
    baseURL: 'BASE_API',
    url: '/jcyw/user/' + userid + '/resources/tree',
    method: 'get'
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    baseURL: 'BASE_API',
    url: '/jcyw/user/password',
    method: 'put',
    data
  })
}
