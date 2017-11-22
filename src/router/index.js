import Vue from 'vue'
import Router from 'vue-router'
import airplanes from '@/components/pages/airplanes'

import login from '@/components/pages/login'
import restore from '@/components/pages/restore'
import setup from '@/components/pages/setup'

import statusOverview from '@/components/pages/status/overview'
import statusMetrics from '@/components/pages/status/metrics'
import notFound from '@/components/pages/notfound'
import auth from '@/components/auth'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      alias: '/',
      name: 'login',
      component: login
    },
    {
      path: '/restore',
      name: 'restore',
      component: restore
    },
    {
      path: '/setup',
      name: 'setup',
      component: setup
    },
    {
      path: '/admin/airplanes',
      name: 'airplanes',
      component: airplanes
    },
    {
      path: '/admin/status/overview',
      name: 'statusOverview',
      component: statusOverview
    },
    {
      path: '/admin/status/metrics',
      name: 'statusMetrics',
      component: statusMetrics
    },
    {
      path: '*',
      component: notFound
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.fullPath.indexOf('/admin/') !== -1 && !auth.user.authenticated) {
    auth.user.redirect = to.fullPath
    next('/login')
  } else {
    next()
  }
})
export default router
