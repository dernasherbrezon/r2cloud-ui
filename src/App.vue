<template>
  <body>
    <b-navbar toggleable="md" type="dark" variant="dark" v-if="currentUser.authenticated">
    	<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    	<b-navbar-brand href="#">r2cloud</b-navbar-brand>
    	<b-collapse is-nav id="nav_collapse">
			<b-navbar-nav>
			  <b-nav-item to="/airplanes">Airplanes</b-nav-item>
			  <b-nav-item to="/status">Status</b-nav-item>
			  <b-nav-item href="#">Configuration</b-nav-item>
			</b-navbar-nav>
			<b-navbar-nav class="ml-auto">
				<b-nav-item v-on:click.prevent="logout">Logout</b-nav-item>
			</b-navbar-nav>
		</b-collapse>
    </b-navbar>
    <div class="container">
    	<router-view/>
    </div>
  </body>
</template>

<script>

import auth from '@/components/auth'

export default {
  name: 'app',
  data () {
    return {
      currentUser: auth.user
    }
  },
  methods: {
    logout () {
      auth.user.authenticated = false
      this.$router.push('/login')
    }
  }
}
</script>

