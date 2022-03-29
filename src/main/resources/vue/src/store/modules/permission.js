import { constantRouterMap } from '@/router/index'
import store from '../index'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

function replaceMenuIcon(accessedRouters, icons) {
  accessedRouters.forEach((router) => {
    if (router.meta && router.meta.icon) {
      let role = router.meta.roles
      if (role) {
        role = role[0]
        icons.forEach((icon) => {
          if (icon.path === role) {
            router.meta.icon = icon.icon
          }
        })
      }
    }
    if (router.customs && router.customs.length > 0) {
      let defaultNode = null
      let custidNode = null
      router.customs.forEach(item => {
        if (!item.meta.custid) {
          defaultNode = item
        } else if (item.meta.custid === store.getters.currentUser.custid) {
          custidNode = item
        }
      })
      if (!custidNode) {
        custidNode = defaultNode
      }
      if (custidNode) {
        router.component = custidNode.component
      }
    }
    if (router.children && router.children.length > 0) {
      replaceMenuIcon(router.children, icons)
    }
  })
}

function getIcons(resources) {
  let icons = []
  resources.forEach((resource) => {
    icons.push({ path: resource.nodeattr.path, icon: resource.nodeicon })
    if (resource.children && resource.children.length > 0) {
      icons = icons.concat(getIcons(resource.children))
    }
  })
  return icons
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      let asyncRouterMap = constantRouterMap
      // if (store.getters.style.code === 'reduction') { // 简约模式
      //   asyncRouterMap = asyncRouterMapReduction
      // } else if (store.getters.style.code === 'classic') { // 经典模式
      //   asyncRouterMap = asyncRouterMapClassic
      // }
      return new Promise(resolve => {
        const { roles, resources } = data
        let accessedRouters
        if (roles.includes('superadmin')) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        if (resources && resources.length > 0) {
          const icons = getIcons(resources)
          replaceMenuIcon(accessedRouters, icons)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
