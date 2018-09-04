import Vue from 'vue'
import App from './App'
import router from './router.js'
import BootstrapVue from 'bootstrap-vue'
import VueCookie from 'vue-cookie'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'font-awesome/css/font-awesome.css'
import messages from '@/components/validation.js'
import Validator from 'vee-validate'
import Auth from '@/components/auth.js'
import HTTP from '@/components/http.js'

Vue.use(VueCookie)
Vue.use(BootstrapVue)
Vue.use(Validator)
Vue.config.productionTip = false

Vue.prototype.$http = HTTP

Vue.mixin({
  methods: {
    handleError (vm, error) {
      if (error.response) {
        if (error.response.data && error.response.data.errors) {
          vm.$validator.validate().then(() => {
            for (var property in error.response.data.errors) {
              if (error.response.data.errors.hasOwnProperty(property)) {
                vm.errors.add(property, error.response.data.errors[property])
              }
            }
          })
        } else {
          vm.$validator.validate().then(() => {
            vm.errors.add('general', 'Internal server error')
          })
        }
        if (error.response.status === 404) {
          vm.$router.push('/404')
        }
      } else if (error.request) {
        vm.$validator.validate().then(() => {
          vm.errors.add('general', 'Internal server error')
        })
      } else {
        console.log(error)
        vm.$validator.validate().then(() => {
          vm.errors.add('general', 'Internal error')
        })
      }
    },
    navigateAfterAuthentication (vm) {
      if (Auth.redirect !== '') {
        vm.$router.push(Auth.redirect)
        Auth.redirect = ''
      } else {
        vm.$router.push('/admin/status/overview')
      }
    }
  }
})

/* eslint-disable no-new */
var vue = new Vue({
  el: 'body',
  router,
  render: h => h(App),
  created () {
    var vm = this
    vm.$validator.localize(messages)
    vm.$http.interceptors.response.use(function (response) {
      return response
    }, function (error) {
      if (error.response && error.response.status === 401 && error.config.url.indexOf('accessToken') === -1) {
        Auth.logout()
        vue.$router.push('/login')
      }
      return Promise.reject(error)
    })
  }
})
