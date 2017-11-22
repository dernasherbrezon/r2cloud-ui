<template>
      <form class="form-signin">
        <legend>Restore</legend>
        <b-alert variant="danger"
             dismissible
             :show="error !== ''">
          {{ error }}
        </b-alert>
        <p>Please enter email address specified during initial setup.</p>
        <div class="form-group">
          <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required="" autofocus="" v-model="username">
        </div>
        <button class="btn btn-lg btn-primary btn-block" v-on:click.prevent="submit">Restore</button>
      </form>
</template>
<script>
  export default {
    data () {
      return {
        username: '',
        error: ''
      }
    },
    methods: {
      submit () {
        // call backend and route to setup if OK
        this.$router.push('/setup')
      }
    }
  }
</script>
