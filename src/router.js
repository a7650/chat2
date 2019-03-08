import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('components/login/login.vue')
    },
    {
      path:'/home',
      name:'home',
      redirect:'/home/message',
      component:() => import('components/home/home.vue'),
      children:[
        {
          path:'/home/message',
          component:()=>import('components/message/message.vue')
        }
      ]
    }
  ]
})
