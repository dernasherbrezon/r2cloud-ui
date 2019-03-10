<template>
  <body>
    <b-navbar toggleable="md" type="dark" variant="dark" v-if="currentUser.authenticated && currentUser.generalSetup">
    	<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    	<b-navbar-brand href="#">r2cloud</b-navbar-brand>
    	<b-collapse is-nav id="nav_collapse">
			<b-navbar-nav>
			  <b-nav-item to="/admin/airplanes"><i class="fa fa-plane" aria-hidden="true"></i>&nbsp;Airplanes</b-nav-item>
              <b-nav-item to="/admin/observation/list"><i class="fa fa-map" aria-hidden="true"></i>&nbsp;Observations</b-nav-item>
              <b-nav-item to="/admin/schedule/list"><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;Schedule</b-nav-item>
              <b-nav-item to="/admin/tle"><i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;TLE</b-nav-item>
			</b-navbar-nav>
			<b-navbar-nav class="ml-auto">
              <b-nav-item-dropdown text="Status">
                <b-dropdown-item to="/admin/status/overview">Overview</b-dropdown-item>
                <b-dropdown-item to="/admin/status/metrics">Metrics</b-dropdown-item>
              </b-nav-item-dropdown>              
              <b-nav-item-dropdown text="Configuration">
                <b-dropdown-item to="/admin/config/general">General</b-dropdown-item>
                <b-dropdown-item to="/admin/config/ddns">DDNS</b-dropdown-item>
                <b-dropdown-item to="/admin/config/ssl">SSL</b-dropdown-item>
                <b-dropdown-item to="/admin/config/r2cloud">R2Cloud</b-dropdown-item>
              </b-nav-item-dropdown>
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
import auth from '@/components/auth.js'

export default {
  name: 'app',
  data () {
    return {
      currentUser: auth
    }
  },
  methods: {
    logout () {
      auth.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style type="text/css">
.form-signin {
  max-width: 360px;
  padding: 15px;
  margin: 0 auto;
    position: absolute;
    top: 20%;
    left: 0;
    right: 0;
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, .2);
    background-color: #f5f5f5;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
</style>

