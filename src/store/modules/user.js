import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  username: '',
  email: '',
  phone: '',
  roles: [],
  petName: '',
  icon: '',
  organizationName: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ICON: (state, icon) => {
    state.icon = icon
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_PETNAME: (state, petName) => {
    state.petName = petName
  },
  SET_NAME: (state, name) => {
    state.username = name
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ORGANIZATIONNAME: (state, name) => {
    state.organizationName = name
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ identification: username.trim(), password: password }).then(response => {
        commit('SET_TOKEN', response.token)
        setToken(response.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const data = response

        console.log(typeof data)

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { role, username, email, phone, petName, orgName, icon } = data

        // roles must be a non-empty array
        if (!role || role.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', role)
        commit('SET_NAME', username)
        commit('SET_EMAIL', email)
        commit('SET_ORGANIZATIONNAME', orgName)
        commit('SET_PHONE', phone)
        commit('SET_PETNAME', petName)
        commit('SET_ICON', icon)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_NAME', '')
      commit('SET_ICON', '')
      commit('SET_PHONE', '')
      commit('SET_PETNAME', '')
      commit('SET_EMAIL', '')
      commit('SET_ORGANIZATIONNAME', '')
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
