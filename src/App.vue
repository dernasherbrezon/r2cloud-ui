<template>
  <body>
    <b-navbar toggleable="md" type="dark" variant="dark" v-if="currentUser.authenticated">
    	<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    	<b-navbar-brand href="#">r2cloud</b-navbar-brand>
    	<b-collapse is-nav id="nav_collapse">
			<b-navbar-nav>
			  <b-nav-item to="/admin/airplanes">Airplanes</b-nav-item>
		      <b-nav-item-dropdown text="Status">
		        <b-dropdown-item to="/admin/status/overview">Overview</b-dropdown-item>
		        <b-dropdown-item to="/admin/status/metrics">Metrics</b-dropdown-item>
		      </b-nav-item-dropdown>			  
              <b-nav-item-dropdown text="Configuration">
                <b-dropdown-item to="/admin/config/general">General</b-dropdown-item>
                <b-dropdown-item to="/admin/config/ddns">DDNS</b-dropdown-item>
                <b-dropdown-item to="/admin/config/ssl">SSL</b-dropdown-item>
              </b-nav-item-dropdown>              
			</b-navbar-nav>
			<b-navbar-nav class="ml-auto">
				<b-nav-item v-on:click.prevent="logout">Logout</b-nav-item>
			</b-navbar-nav>
		</b-collapse>
    </b-navbar>
    <div class="container pt-3">
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

