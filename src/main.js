import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import VueSocketio from 'vue-socket.io'
import './assets/index.less'


Vue.config.productionTip = false
const development = true
let url = development ? 'localhost:8000' : 'http://106.12.198.147:8000'
Vue.use(new VueSocketio({
    connection:url
}))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
