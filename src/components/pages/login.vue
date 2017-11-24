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
  import auth from '../auth'

  export default {
    data () {
      return {
        username: 'test@example.com',
        password: '1'
      }
    },
    methods: {
      validateBeforeSubmit (e) {
        this.$validator.errors.clear()
        this.$validator.validateAll()
        if (!this.errors.any()) {
          this.submit()
        }
      },
      submit () {
        this.$validator.validate().then(() => {
          this.errors.add('username', 'test error from backend')
          this.errors.add('general', 'test error from backend')
        }).catch(() => {
          this.errors.add('general', 'Fatal error during validation')
        })
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
