import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'

Vue.use(VueRouter)
import App from './App'
import Vuex from 'vuex'
Vue.use(Vuex)

import vuexI18n from 'vuex-i18n'

require('es6-promise').polyfill()

/**
* you can add your module here
*/
let store = new Vuex.Store({
  modules: {
    i18n: vuexI18n.store
  }
})
let objCount = function (obj) {
  if (obj === undefined) {
    return 0
  }
  if (typeof (obj) !== 'object') {
    return 0
  }
  var i = 0
  for (var k in obj) {
    if (k) i++
  }
  return i
}
window.clone = function (obj) {
  if (typeof obj !== 'object') {
    return obj
  }
  if (obj === null) {
    return null
  }
  var o
  if (obj instanceof Array) {
    o = []
    for (var i = 0, len = obj.length; i < len; i++) {
      o.push(window.clone(obj[i]))
    }
  } else {
    o = {}
    for (var j in obj) {
      o[j] = window.clone(obj[j])
    }
  }
  return o
}
store.registerModule('vux', {
  state: {
    demoScrollTop: 0,
    isLoading: false,
    direction: 'forward',
    session: null,
    showRadioPlayer: false
  },
  mutations: {
    updateDemoPosition (state, payload) {
      state.demoScrollTop = payload.top
    },
    setSession (state, payload) {
      state.session = payload.session
    },
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    },
    updateDirection (state, payload) {
      state.direction = payload.direction
    },
    setRadioPlayer (state, payload) {
      state.showRadioPlayer = payload.bool
    }
  },
  actions: {
    updateDemoPosition ({commit}, top) {
      commit({type: 'updateDemoPosition', top: top})
    },
    setSession ({commit}, session) {
      commit({type: 'setSession', session: session})
    },
    setRadioPlayer ({commit}, bool) {
      commit({type: 'setRadioPlayer', bool: bool})
    }
  },
  getters: {
    apiInited: state => {
      return typeof (state.session) === 'object'
    },
    isLogin: state => {
      if (state.session === null) {
        return false
      }
      return objCount(state.session.profile) > 0
    },
    nickname: state => {
      if (state.session === null) {
        return '-'
      }
      if (!state.session.hasOwnProperty('profile')) {
        return '-'
      }
      return state.session.profile.nickname
    }
  }
})

Vue.use(vuexI18n.plugin, store)

// plugins
import { LocalePlugin, DevicePlugin, ToastPlugin, AlertPlugin, ConfirmPlugin, LoadingPlugin, WechatPlugin, AjaxPlugin, AppPlugin } from 'vux'
Vue.use(DevicePlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(WechatPlugin)
Vue.use(AjaxPlugin)
Vue.use(LocalePlugin)

// test
if (process.env.platform === 'app') {
  Vue.use(AppPlugin, store)
}

const wx = Vue.wechat
const http = Vue.http
import API from './firadio/api/API'
let api = new API()
window.api = api
/**
* -------------------------- 微信分享 ----------------------
* 请不要直接复制下面代码
*/

if (0 && process.env.NODE_ENV === 'production') {
  wx.ready(() => {
    console.log('wechat ready')
    wx.onMenuShareAppMessage({
      title: 'VUX', // 分享标题
      desc: '基于 WeUI 和 Vue 的移动端 UI 组件库',
      link: 'https://vux.li?x-page=wechat_share_message',
      imgUrl: 'https://static.vux.li/logo_520.png'
    })

    wx.onMenuShareTimeline({
      title: 'VUX', // 分享标题
      desc: '基于 WeUI 和 Vue 的移动端 UI 组件库',
      link: 'https://vux.li?x-page=wechat_share_timeline',
      imgUrl: 'https://static.vux.li/logo_520.png'
    })
  })

  const permissions = JSON.stringify(['onMenuShareTimeline', 'onMenuShareAppMessage'])
  const url = document.location.href
  http.post('https://vux.li/jssdk?url=' + encodeURIComponent(url.split('#')[0]) + '&jsApiList=' + permissions).then(res => {
    wx.config(res.data.data)
  })
}

import objectAssign from 'object-assign'

const vuxLocales = require('json-loader!yaml-loader!vux/src/locales/all.yml')
const componentsLocales = require('json-loader!yaml-loader!src/locales/components.yml')
const globalLocales = require('json-loader!yaml-loader!src/locales/global_locales.yml') || {en: {}, 'zh-CN': {}}

const finalLocales = {
  'en': objectAssign(vuxLocales['en'], componentsLocales['en'], globalLocales['en']),
  'zh-CN': objectAssign(vuxLocales['zh-CN'], componentsLocales['zh-CN'], globalLocales['zh-CN'])
}

for (let i in finalLocales) {
  Vue.i18n.add(i, finalLocales[i])
}
const nowLocale = Vue.locale.get()
console.log(nowLocale)
console.log(Vue.locale)
if (/zh/.test(nowLocale)) {
  Vue.i18n.set('zh-CN')
} else {
  Vue.i18n.set('en')
}

const FastClick = require('fastclick')
FastClick.attach(document.body)

// The following line will be replaced with by vux-loader with routes in ./demo_list.json
const routes = []

const router = new VueRouter({
  routes
})

sync(store, router)

// simple history management
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)

router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {isLoading: true})

  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  if (toIndex) {
    if (toIndex > fromIndex || !fromIndex || (toIndex === '0' && fromIndex === '0')) {
      store.commit('updateDirection', {direction: 'forward'})
    } else {
      store.commit('updateDirection', {direction: 'reverse'})
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('updateDirection', {direction: 'forward'})
  }

  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next()
  }
})

router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {isLoading: false})
  if (0 && process.env.NODE_ENV === 'production') {
    ga && ga('set', 'page', to.fullPath)
    ga && ga('send', 'pageview')
  }
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
