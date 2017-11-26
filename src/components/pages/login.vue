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
  import HTTP from '@/components/http.js'
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
        HTTP.post('/accessToken', vm.$data).then(function (response) {
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
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('error response')
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
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
        })
      }
    }
  }
</script>
