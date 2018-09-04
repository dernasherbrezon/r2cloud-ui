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
        <button class="btn btn-lg btn-primary btn-block" :disabled="submitting" type="submit">Sign in</button>
		<div style="padding-top: 20px;">
			<router-link to="/restore">Forgot password</router-link>
		</div>        
      </form>
</template>
<script>
  import auth from '@/components/auth.js'

  export default {
    data () {
      return {
        username: '',
        password: '',
        submitting: false
      }
    },
    created () {
      var vm = this
      vm.$http.get('/configured').then(function (response) {
        auth.setGeneralSetup(response.data.generalSetup)
        if (!response.data.configured) {
          vm.$router.push('/setup')
        } else if (!response.data.generalSetup) {
          auth.redirect = '/admin/setup/wizard'
        }
      })
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
        if (this.submitting) {
          return
        }
        this.submitting = true

        var vm = this
        vm.$http.post('/accessToken', vm.$data).then(function (response) {
          vm.submitting = false
          auth.authenticate(response.data.access_token)
          vm.navigateAfterAuthentication(vm)
        }).catch(function (error) {
          vm.submitting = false
          vm.handleError(vm, error)
        })
      }
    }
  }
</script>
