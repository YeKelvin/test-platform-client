import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import _ from 'lodash'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 请求的 base url
  timeout: 5000, // 超时时长
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// loading对象
let loading

// 当前正在请求的数量
let needLoadingRequestCount = 0

// 显示loading
function showLoading() {
  // 后面这个判断很重要，因为关闭时加了抖动，此时 loading对象可能还存在，
  // 但 needLoadingRequestCount已经变成0，避免这种情况下会重新创建个 loading
  if (needLoadingRequestCount === 0 && !loading) {
    loading = Loading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.5)'
    })
  }
  needLoadingRequestCount++
}

// 隐藏loading
function hideLoading() {
  needLoadingRequestCount--
  needLoadingRequestCount = Math.max(needLoadingRequestCount, 0) // 做个保护
  if (needLoadingRequestCount === 0) {
    // 关闭loading
    toHideLoading()
  }
}

// 防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
const toHideLoading = _.debounce(() => {
  loading.close()
  loading = null
}, 300)

// 请求拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'JWT ' + getToken()
    }
    // 判断当前请求是否设置了不显示Loading
    if (config.method !== 'get') {
      showLoading()
    }
    return config
  },
  error => {
    // 判断当前请求是否设置了不显示Loading
    if (error.config.method !== 'get') {
      hideLoading()
    }
    Message({ message: error.message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const { data } = response
    // 判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
    if (response.config.method !== 'get') {
      hideLoading()
    }
    if (response.status !== 200) {
      Message({ message: response.statusText || 'Error!', type: 'error', duration: 5 * 1000 })
      return Promise.reject(new Error(response.statusText || 'Error!'))
    } else {
      // 判断用户 token是否有效，无效或失效则转跳至登录页
      if (!data.success && data.errorCode === 'E401001') {
        MessageBox.confirm('登录失效，请重新登录', '警告', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      if (!data.success || data.errorCode) {
        Message({ message: data.errorMsg || 'Error!', type: 'error', duration: 5 * 1000 })
        return Promise.reject(new Error(data.errorMsg || 'Error!'))
      }
      return data
    }
  },
  error => {
    // 判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
    if (error.config.method !== 'get') {
      hideLoading()
    }
    Message({ message: error.message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

export default service

// todo 页面转跳时取消所有未返回的请求
