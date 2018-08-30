<template>
  <div class="row">
    <div class="col-md-12" v-if="!loading">
      <satellites :satellites="satellites" v-if="!loading"/>
    </div>
    <div class="col-md-12" style="text-align: center;" v-else>
      <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>
      <span class="sr-only">Loading...</span>          
    </div>
  </div>
</template>

<script>
import satellites from '@/components/pages/satellites.vue'

export default {
  name: 'amateur',
  components: {satellites},
  data () {
    return {
      satellites: [],
      loading: true
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      const vm = this
      vm.$http.get('/admin/amateur').then(function (response) {
        vm.satellites = response.data.satellites
        vm.loading = false
      })
    }
  }
}
</script>
