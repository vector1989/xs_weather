import { loginByUsername, logout, checkRole } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getResourceTreeByUserAndRole } from '@/api/login'
import store from '../index'

const user = {
  state: {
    userinfo: {},
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [], // 用户的菜单权限列表
    resources: [], // 所有权限资源信息
    childResources: {}, // 子分组所有权限资源信息
    currentUser: {}, // 当前用户
    subPlatformId: '', // 子平台id
    userRoles: [], // 用户拥有的角色列表
    currentRole: {}, // 当前选择的用户
    setting: {
      articlePlatform: []
    },
    style: { code: 'classic', name: '经典模式', 'loadRouter': true, 'systemName': '测试平台' }, // 首页风格 默认经典风格
    styleList: [{ code: 'classic', name: '经典模式', 'loadRouter': true, 'systemName': '测试平台' }, { code: 'reduction', name: '简约模式', 'loadRouter': false, 'systemName': '测试平台' }]
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_RESOURCES: (state, resources) => {
      state.resources = resources
    },
    SET_CHILD_RESOURCES: (state, childResources) => {
      state.childResources = childResources
    },
    SET_CURRENT_USER: (state, currentUser) => {
      state.currentUser = currentUser
    },
    SET_SUB_PLATFORM_ID: (state, subPlatformId) => {
      state.subPlatformId = subPlatformId
    },
    SET_USER_ROLES: (state, userRoles) => {
      state.userRoles = userRoles
    },
    SET_CURRENT_ROLE: (state, currentRole) => {
      state.currentRole = currentRole
    },
    SET_STYLE: (state, style) => {
      state.style = style
    },
    SET_IS_INTERANET: (state, isIntranet) => {
      state.isIntranet = isIntranet
    }
  },

  actions: {
    getTreeByRoleidAndUserid({ commit, state }, userAndRole) {
      return new Promise((resolve, reject) => {
        getResourceTreeByUserAndRole(userAndRole).then(response => {
          console.info(response)
          if (response.code === 0) {
            const data = response.data
            commit('SET_RESOURCES', data)
            commit('SET_CHILD_RESOURCES', data[0] || ['error'])
            window.localStorage.setItem('userResources', JSON.stringify(data))
            window.localStorage.setItem('userChildResources', JSON.stringify(data[0] || ['error']))
            resolve()
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 用户名登录
    LoginByUsername({ commit, state }, userInfo) {
      // const resources = []
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo).then(response => {
          if (response.code === 0) {
            // const resources = data.data.resources
            // 不在这设置token
            // commit('SET_TOKEN', data.data.access_token)
            // commit('SET_RESOURCES', resources)
            // commit('SET_CHILD_RESOURCES', resources[0] || ['error'])
            commit('SET_NAME', response.data.user.name)
            commit('SET_CURRENT_USER', response.data.user)
            setToken(response.data.access_token)

            // window.localStorage.setItem('userResources', JSON.stringify(resources))
            // window.localStorage.setItem('userChildResources', JSON.stringify(resources[0] || ['error']))
            window.localStorage.setItem('userName', JSON.stringify(response.data.user.name))
            window.localStorage.setItem('currentUser', JSON.stringify(response.data.user))

            resolve(response)
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 检查角色
    CheckRole({ commit, state }, checkRoleData) {
      return new Promise((resolve, reject) => {
        checkRole(checkRoleData).then(response => {
          if (response.code === 0) {
            commit('SET_TOKEN', response.data)
            setToken(response.data)
            resolve(response)
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      const orgName = localStorage.getItem('orgName')
      if (orgName) {
        const systemName = state.style.systemName.replace('医院', '')
        document.getElementsByTagName('title')[0].innerText = /* orgName + */ systemName
      }
      if (window.localStorage.getItem('userResources')) {
        commit('SET_RESOURCES', JSON.parse(window.localStorage.getItem('userResources')))
      }
      if (window.localStorage.getItem('userChildResources')) {
        commit('SET_CHILD_RESOURCES', JSON.parse(window.localStorage.getItem('userChildResources')))
      }
      if (window.localStorage.getItem('userName')) {
        commit('SET_NAME', JSON.parse(window.localStorage.getItem('userName')))
      }
      if (window.localStorage.getItem('systemName')) {
        store.dispatch('setSystemName', JSON.parse(window.localStorage.getItem('systemName')))
      }
      if (window.localStorage.getItem('currentUser')) {
        commit('SET_CURRENT_USER', JSON.parse(window.localStorage.getItem('currentUser')))
      }
      if (window.localStorage.getItem('subPlatformId')) {
        commit('SET_SUB_PLATFORM_ID', window.localStorage.getItem('subPlatformId'))
      }
      if (window.localStorage.getItem('userRoles')) {
        commit('SET_USER_ROLES', JSON.parse(window.localStorage.getItem('userRoles')))
      }
      if (window.localStorage.getItem('currentRole')) {
        commit('SET_CURRENT_ROLE', JSON.parse(window.localStorage.getItem('currentRole')))
      }
      if (window.localStorage.getItem('style')) {
        commit('SET_STYLE', JSON.parse(window.localStorage.getItem('style')))
      }
      return new Promise((resolve, reject) => {
        const roles = []
        if (!state.style.loadRouter) {
          const childResources = state.childResources
          if (childResources.nodeattr.path) {
            roles.push(childResources.nodeattr.path)
          }
          getRoles(childResources.children, roles)
        } else {
          const resources = state.resources
          getRoles(resources, roles)
        }
        if (roles && roles.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', roles)
        } else {
          reject('getInfo: roles must be a non-null array !')
        }

        resolve(roles)
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, data) {
      return new Promise(resolve => {
        const { roles, resources } = data
        // commit('SET_TOKEN', roles)
        // setToken(roles)
        // getUserInfo(role).then(response => {
        // const roles = store.getters.roles // response.data
        commit('SET_ROLES', roles)
        // commit('SET_NAME', data.name)
        // commit('SET_AVATAR', data.avatar)
        // commit('SET_INTRODUCTION', data.introduction)
        dispatch('GenerateRoutes', { roles, resources }) // 动态修改权限后 重绘侧边菜单
        resolve(roles)
        // })
      })
    },
    // 设置菜单列表权限
    SetRoles({ commit }, roles) {
      commit('SET_ROLES', roles)
    },
    // 设置权限
    SetResources({ commit }, resouces) {
      commit('SET_RESOURCES', resouces)
    },
    // 设置子分组资源
    SetChildResources({ commit }, childResources) {
      commit('SET_CHILD_RESOURCES', childResources)
    },
    // 设置用户信息
    SetCurrentUser({ commit }, currentUser) {
      commit('SET_CURRENT_USER', currentUser)
    },
    // 设置用户信息
    SetSubPlatformId({ commit }, subPlatformId) {
      commit('SET_SUB_PLATFORM_ID', subPlatformId)
    },
    // 设置角色列表
    SetUserRoles({ commit }, userRoles) {
      commit('SET_USER_ROLES', userRoles)
    },
    // 设置当前选择角色
    SetCurrentRole({ commit }, currentRole) {
      commit('SET_CURRENT_ROLE', currentRole)
    },
    // 设置当前选择角色
    SetStyle({ commit }, style) {
      commit('SET_STYLE', style)
    }
  }
}
export function getRoles(resources, roles) {
  if (resources && resources.length > 0) {
    resources.forEach((item) => {
      if (item.nodeattr && item.nodeattr.path) {
        roles.push(item.nodeattr.path)
      }
      if (item.children) {
        getRoles(item.children, roles)
      }
    })
  }
}
export default user
