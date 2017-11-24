<template>
	  <form @submit.prevent="validateBeforeSubmit" class="form-signin">
	  	<legend>Login</legend>
	  	<b-alert variant="danger"
             dismissible
             :show="errors.has('general')">
          {{ errors.first('general') }}
        </b-alert>
        <div class="form-group" :class="{'has-danger': errors.has('username') }">
          <input type="email" id="inputEmail" name="username" :class="{'is-invalid': errors.has('username') }" class="form-control" placeholder="Email address" autofocus="" v-model="username">
          <div class="invalid-feedback" v-if="errors.has('username')">{{ errors.first('username') }}</div>
        </div>
        <div class="form-group" :class="{'has-danger': errors.has('password') }">
          <input type="password" id="inputPassword" name="password" :class="{'is-invalid': errors.has('password') }" class="form-control" placeholder="Password" v-model="password">
          <div class="invalid-feedback" v-if="errors.has('password')">{{ errors.first('password') }}</div>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
		<div style="padding-top: 20px;">
			<router-link to="/restore">Forgot password</router-link>
		</div>        
      </form>
</template>
<script>
  import auth from '../auth'
  import { Validator, ErrorBag } from 'vee-validate'
  import messages from '@/components/validation'

  export default {
    data () {
      return {
        username: 'test@example.com',
        password: '1',
        errors: new ErrorBag()
      }
    },
    methods: {
      validateBeforeSubmit (e) {
        const validator = new Validator({
          username: 'required|email',
          password: 'required'
        })
        this.errors.clear()
        validator.updateDictionary(messages)
        validator.validateAll(this.$data).then(result => {
          if (!result) {
            this.errors = validator.errors
          } else {
            this.submit()
          }
        }).catch(() => {
          this.errors.add('general', 'Fatal error during validation')
        })
      },
      submit () {
        // this.errors.add('username', 'test error from backend')
        auth.user.authenticated = true
        if (auth.user.redirect !== '') {
          this.$router.push(auth.user.redirect)
          auth.user.redirect = ''
        } else {
          this.$router.push('/admin/status/overview')
        }
      }
    }
  }
</script>
