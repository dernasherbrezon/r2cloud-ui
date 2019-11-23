<template>
  <vue-openapi-bootstrap :openapi="openapi" v-if="!loading"></vue-openapi-bootstrap>
  <div class="col-md-12" style="text-align: center;" v-else="loading">
    <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>
    <span class="sr-only">Loading...</span>          
  </div>  
</template>

<script>
import vueOpenapiBootstrap from 'vue-openapi-bootstrap/src/vue-openapi-bootstrap'

export default {
  components: {vueOpenapiBootstrap},
  data () {
    return {
      openapi: {},
      loading: true
    }
  },
  mounted () {
    const vm = this
    vm.$http({
      method: 'get',
      url: '/static/openapi.json',
      baseURL: ''
    }).then(function (response) {
      vm.openapi = response.data
      vm.loading = false
    }).catch(function (error) {
      vm.handleError(vm, error)
    })
  }
}
</script>