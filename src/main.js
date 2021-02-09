import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import store from './store'
import router from './router'
import './utils/directive'

import '@/icons'
import '@/styles/index.scss'
import '@/permission'

import Lodash from 'lodash'

import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

const socketOptions = {
  autoConnect: false
}

// 全局注册插件
Vue.use(ElementUI)
Vue.use(new VueSocketIO({
  debug: process.env.NODE_ENV === 'development',
  connection: SocketIO(process.env.VUE_APP_BASE_API, socketOptions)
}))

// 绑定到Vue原型上
Vue.prototype.$_ = Lodash

// 在生产环境不提示
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
