import Vue from 'vue'
import App from './App'
import ClipboardJS from 'clipboard'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

new ClipboardJS('.btn');
