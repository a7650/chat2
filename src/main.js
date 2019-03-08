import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import VueSocketio from 'vue-socket.io'
import './assets/index.less'

Vue.config.productionTip = false
Vue.use(new VueSocketio({
    connection:'localhost:8000/'
  }))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
