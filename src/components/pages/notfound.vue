<template>
	  <div class="jumbotron col-md-12">
        <h1>404</h1>
        <p class="lead">Not found</p>
        <p><a class="btn btn-info" v-on:click.prevent="back" href="#">Back</a></p>
      </div>
</template>
<script>
  export default {
    methods: {
      back () {
        this.$router.go(-1)
      }
    }
  }
</script>