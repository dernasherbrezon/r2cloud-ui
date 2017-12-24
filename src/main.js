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
import auth from '@/components/auth.js'
import axios from 'axios'
import HTTP from '@/components/http.js'

Vue.use(VueCookie)
Vue.use(BootstrapVue)
Vue.use(Validator)
Vue.config.productionTip = false

Vue.prototype.$http = HTTP

var token = localStorage.getItem('access_token')
if (token) {
  auth.user.authenticated = true
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

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
    authenticate (vm, token) {
      auth.user.authenticated = true
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      localStorage.setItem('access_token', token)
      if (auth.user.redirect !== '') {
        vm.$router.push(auth.user.redirect)
        auth.user.redirect = ''
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
  beforeCreate () {
    var vm = this
    vm.$validator.updateDictionary(messages)
    vm.$http.interceptors.response.use(function (response) {
      return response
    }, function (error) {
      if (error.response && error.response.status === 401 && error.config.url.indexOf('accessToken') === -1) {
        auth.user.authenticated = false
        delete axios.defaults.headers.common['Authorization']
        vue.$router.push('/login')
      }
      return Promise.reject(error)
    })
  }
})
