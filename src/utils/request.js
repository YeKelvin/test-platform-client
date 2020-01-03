import axios from 'axios'
import { /* MessageBox,*/ Message } from 'element-ui'
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
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const { data } = response
    if (response.status !== 200) {
      Message({
        message: response.statusText || 'Error!',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(response.statusText || 'Error!'))
    } else {
      if (!data.success || data.errorCode) {
        Message({
          message: data.errorMsg || 'Error!',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(data.errorMsg || 'Error!'))
      }
      return data
    }
  },
  error => {
    console.log('err:' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
