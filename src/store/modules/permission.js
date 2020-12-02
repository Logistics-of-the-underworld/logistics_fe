import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    // r2.some(v => v[0] === r1[0] && v[1] === r1[1])
    return roles[0] === route.meta.roles[0] && roles[1] === route.meta.roles[1]
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {

      const r1 = ['admin', 'admin']

      const r2 = [['admin', 'admin'], ['admin', 'normal']]

      console.log(r2.some(v => v[0] === r1[0] && v[1] === r1[1]))

      r2.forEach(r => {
        if (r1[0] === r[0] && r1[1] === r[1]) {
          console.log(r1[0] === r[0] && r1[1] === r[1])
        }
      })

      const accessedRoutes = filterAsyncRoutes(asyncRoutes, JSON.parse(roles))
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
