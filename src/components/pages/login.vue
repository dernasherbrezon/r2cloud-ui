<template>
	  <form @submit.prevent="validateBeforeSubmit" class="form-signin">
	  	<legend>Login</legend>
	  	<b-alert variant="danger"
             dismissible
             :show="errors.has('general')">
          {{ errors.first('general') }}
        </b-alert>
        <div class="form-group" :class="{'has-danger': errors.has('username') }">
          <input type="email" id="inputEmail" name="username" :class="{'is-invalid': errors.has('username') }" class="form-control" v-validate="'required|email'" placeholder="Email address" autofocus="" v-model="username">
          <div class="invalid-feedback" v-if="errors.has('username')">{{ errors.first('username') }}</div>
        </div>
        <div class="form-group" :class="{'has-danger': errors.has('password') }">
          <input type="password" id="inputPassword" name="password" :class="{'is-invalid': errors.has('password') }" class="form-control" v-validate="'required'" placeholder="Password" v-model="password">
          <div class="invalid-feedback" v-if="errors.has('password')">{{ errors.first('password') }}</div>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
		<div style="padding-top: 20px;">
			<router-link to="/restore">Forgot password</router-link>
		</div>        
      </form>
</template>
<script>
  import auth from '@/components/auth.js'
  import axios from 'axios'

  var submitting = false
  
  export default {
    data () {
      return {
        username: 'info@r2cloud.ru',
        password: '1'
      }
    },
    methods: {
      validateBeforeSubmit (e) {
        this.$validator.errors.clear()
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.submit()
          }
        })
      },
      submit () {
        if (submitting) {
          return
        }
        submitting = true

        var vm = this
        vm.$http.post('/accessToken', vm.$data).then(function (response) {
          submitting = false
          auth.user.authenticated = true
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token
          localStorage.setItem('access_token', response.data.access_token)
          if (auth.user.redirect !== '') {
            vm.$router.push(auth.user.redirect)
            auth.user.redirect = ''
          } else {
            vm.$router.push('/admin/status/overview')
          }
        }).catch(function (error) {
          submitting = false
          vm.handleError(vm, error)
        })
      }
    }
  }
</script>
