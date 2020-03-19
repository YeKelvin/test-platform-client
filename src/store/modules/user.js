import * as User from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import userAvatar from '@/assets/user_avatar.gif'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [] }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      User.login({ username: username.trim(), password: password }).then(response => {
        const { result } = response
        commit('SET_TOKEN', result.accessToken)
        setToken(result.accessToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  queryInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      User.queryInfo().then(response => {
        if (!response) {
          reject('身份认证失败或过期，请重新登录')
        }

        const { result } = response
        commit('SET_NAME', result.nickname)
        commit('SET_AVATAR', userAvatar)
        commit('SET_ROLES', result.roles)
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      User.logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

