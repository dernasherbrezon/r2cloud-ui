import Vue from 'vue'
import Router from 'vue-router'
import airplanes from '@/components/pages/airplanes'
import login from '@/components/pages/login'
import status from '@/components/pages/status'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/airplanes',
      name: 'airplanes',
      component: airplanes
    },
    {
      path: '/status',
      name: 'status',
      component: status
    }
  ]
})
