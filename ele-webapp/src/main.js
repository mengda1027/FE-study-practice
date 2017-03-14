import Vue from 'vue'
import App from './App'

// 单独添加规则no-new的例外注释
/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})
