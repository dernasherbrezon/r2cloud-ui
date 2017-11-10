<template>
	  <form class="form-signin">
	  	<legend>Login</legend>
	  	<b-alert variant="danger"
             dismissible
             :show="error != ''">
          {{ error }}
        </b-alert>
        <label for="inputEmail" class="sr-only">Email address</label>
        <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required="" autofocus="" v-model="username">
        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" id="inputPassword" class="form-control" placeholder="Password" required="" v-model="password">
        <button class="btn btn-lg btn-primary btn-block" v-on:click.prevent="submit">Sign in</button>
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
        password: '1',
        error: ''
      }
    },
    methods: {
      submit () {
        auth.user.authenticated = true
        if (auth.user.redirect !== '') {
          this.$router.push(auth.user.redirect)
          auth.user.redirect = ''
        } else {
          this.$router.push('/admin/status')
        }
      }
    }
  }
</script>
