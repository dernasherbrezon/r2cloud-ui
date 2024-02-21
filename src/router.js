import Vue from 'vue'
import Router from 'vue-router'

import login from '@/components/pages/login'
import presentationMode from '@/components/pages/presentationMode'
import restore from '@/components/pages/setup/restore'
import setup from '@/components/pages/setup/setup'
import setupWizard from '@/components/pages/setup/wizard'

import statusOverview from '@/components/pages/status/overview'
import statusMetrics from '@/components/pages/status/metrics'

import configGeneral from '@/components/pages/configuration/general'
import configIntegrations from '@/components/pages/configuration/integrations'

import deviceConfig from '@/components/pages/device/config'

import tle from '@/components/pages/tle'
import observationList from '@/components/pages/observation/list'
import observationEntity from '@/components/pages/observation/entity'

import scheduleList from '@/components/pages/schedule/list'

import api from '@/components/pages/api'

import notFound from '@/components/pages/notfound'
import proxyError from '@/components/pages/proxyError'
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
      path: '/presentationMode',
      name: 'presentationMode',
      component: presentationMode
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
      path: '/admin/setup/wizard',
      name: 'setupWizard',
      component: setupWizard
    },
    {
      path: '/admin/status/overview',
      name: 'statusOverview',
      component: statusOverview
    },
    {
      path: '/',
      redirect: function () {
        if (!auth.authenticated) {
          auth.redirect = '/admin/status/overview'
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
      path: '/admin/config/r2cloud',
      name: 'configIntegrations',
      component: configIntegrations
    },
    {
      path: '/admin/tle',
      name: 'tle',
      component: tle
    },
    {
      path: '/admin/api',
      name: 'api',
      component: api
    },
    {
      path: '/admin/observation/list',
      name: 'observationList',
      component: observationList
    },
    {
      path: '/admin/observation/load',
      name: 'observationEntity',
      component: observationEntity
    },
    {
      path: '/observation/load',
      name: 'observationEntityPresentation',
      component: observationEntity
    },
    {
      path: '/admin/schedule/list',
      name: 'scheduleList',
      component: scheduleList
    },
    {
      path: '/admin/device/config/load',
      name: 'deviceConfig',
      component: deviceConfig
    },
    {
      path: '/404',
      alias: '*',
      component: notFound
    },
    {
      path: '/502',
      alias: '502',
      component: proxyError
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.fullPath.indexOf('/admin/') !== -1 && !auth.authenticated) {
    auth.redirect = to.fullPath
    next('/login')
  } else {
    next()
  }
})
export default router
