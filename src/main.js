import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import store from './store'
import router from './router'

import '@/icons'
import '@/styles/index.scss'
import '@/permission'

import _ from 'lodash'

import Scrollbar from '@/components/Scrollbar/index'

// 全局注册插件
Vue.use(ElementUI)

// 全局注册组件
Vue.component('Scrollbar', Scrollbar)

// 绑定到 Vue原型上
Vue.prototype.$_ = _

// 在生产环境不提示
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
