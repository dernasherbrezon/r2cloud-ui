import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import VueCookie from 'vue-cookie'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'font-awesome/css/font-awesome.css'
import messages from '@/components/validation'
import Validator from 'vee-validate'

Vue.use(VueCookie)
Vue.use(BootstrapVue)
Vue.use(Validator)
Vue.config.productionTip = false

/* eslint-disable no-new */
var vue = new Vue({
  el: 'body',
  router,
  render: h => h(App)
})
vue.$validator.updateDictionary(messages)
