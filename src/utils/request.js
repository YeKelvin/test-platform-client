import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      config.headers['Authorization'] = 'JWT ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    Message({ message: error.message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const { data } = response
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
    // do something with request error
    Message({ message: error.message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

export default service
