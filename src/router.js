import Vue from 'vue'
import Router from 'vue-router'
import airplanes from '@/components/pages/airplanes'

import login from '@/components/pages/login'
import restore from '@/components/pages/setup/restore'
import setup from '@/components/pages/setup/setup'

import statusOverview from '@/components/pages/status/overview'
import statusMetrics from '@/components/pages/status/metrics'

import configGeneral from '@/components/pages/configuration/general'
import configDDNS from '@/components/pages/configuration/ddns'
import configSSL from '@/components/pages/configuration/ssl'

import tle from '@/components/pages/tle'
import weather from '@/components/pages/weather'

import notFound from '@/components/pages/notfound'
import auth from '@/components/auth.js'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
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
      path: '/',
      redirect: function () {
        if (!auth.user.authenticated) {
          auth.user.redirect = '/admin/status/overview'
          return '/login'
        } else {
          return '/admin/status/overview'
        }
      }
    },
    {
      path: '/admin/status/metrics',
      name: 'statusMetrics',
      component: statusMetrics
    },
    {
      path: '/admin/config/general',
      name: 'configGeneral',
      component: configGeneral
    },
    {
      path: '/admin/config/ddns',
      name: 'configDDNS',
      component: configDDNS
    },
    {
      path: '/admin/config/ssl',
      name: 'configSSL',
      component: configSSL
    },
    {
      path: '/admin/tle',
      name: 'tle',
      component: tle
    },
    {
      path: '/admin/weather',
      name: 'weather',
      component: weather
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
