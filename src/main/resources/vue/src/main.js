import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
// import './mock' // simulation data
import ImageViewer from './components/ImageViewer'

import * as filters from './filters' // global filters

const outerHostName = process.env.outerHostName
const innerHostName = process.env.innerHostName
let CONST_BASE_URL = ''
if (location.hostname.indexOf(innerHostName) > -1) {
  // 内网
  CONST_BASE_URL = process.env.inner
} else if (location.hostname.indexOf(outerHostName) > -1) {
  // 外网
  CONST_BASE_URL = process.env.outer
} else {
  // 其他用外网
  CONST_BASE_URL = process.env.outer
}
Vue.prototype.$LOGIN_PATH = 'LOCAL_STORAGE_LOGIN_PATH'
Vue.prototype.$CONST_BASE_URL = CONST_BASE_URL
// Vue.prototype.$DOWNLOAD_BY_PATH = CONST_BASE_URL['BASE_API_FILESERVER'] + '/file/downloadByPath?path=' // 文件下载

// static 路径
let staticBasePath = location.href
if (staticBasePath.indexOf('index.html') > -1) {
  staticBasePath = staticBasePath.substr(0, staticBasePath.indexOf('index.html'))
} else {
  staticBasePath = ''
}
Vue.prototype.$STATIC_BASE_PATH = staticBasePath

Vue.use(Element, {
  size: Cookies.get('size') || 'Small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(ImageViewer)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.directive('enterNumber', {
  inserted: function(el) {
    el.addEventListener('keypress', function(e) {
      e = e || window.event
      const charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode
      const re = /\d/
      if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
      }
    })
  }
})
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
