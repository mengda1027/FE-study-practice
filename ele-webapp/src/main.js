import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import goods from '@/components/goods/goods'
import ratings from '@/components/ratings/ratings'
import seller from '@/components/seller/seller'

import '@/common/stylus/index.styl'

Vue.use(VueRouter)
Vue.use(VueResource)

const routes = [{
  path: '/goods',
  component: goods
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}, {
  path: '/',
  redirect: '/goods'
}]

let router = new VueRouter({
  linkActiveClass: 'active',
  routes
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
