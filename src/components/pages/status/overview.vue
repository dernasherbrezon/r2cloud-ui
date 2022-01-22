<template>
	<div class="row" v-if="!loading">
		<div class="col-md-12" :key="curData.id" v-for="(curData, index) in devices">
		
			<div class="card border-success" v-if="curData.status === 'CONNECTED'">
				<div class="card-header text-success">{{ curData.connection }}</div>
				<ul class="list-group list-group-flush text-success">
				    <li class="list-group-item" v-if="curData.model">Model: {{ curData.model }}</li>
					<li class="list-group-item">Frequencies: {{ curData.minFrequency / 1000000  }} - {{ curData.maxFrequency / 1000000 }} Mhz</li>
				</ul>
				<rotatorStatus :rotator="curData.rotator"/>
			</div>
			
			<div class="card border-danger" v-else-if="curData.status === 'FAILED'">
				<div class="card-header text-danger">{{ curData.connection }}</div>
				<ul class="list-group list-group-flush text-danger">
				    <li class="list-group-item">Status: {{ curData.status }}</li>
				    <li class="list-group-item">Message: {{ curData.failureMessage }}</li>
				</ul>
				<rotatorStatus :rotator="curData.rotator"/>
			</div>
		</div>
	</div>
	<div class="row" v-else>
		<div class="col-md-12" style="text-align: center;">
			<i class="fa fa-cog fa-spin fa-3x fa-fw"></i> <span class="sr-only">Loading...</span>
		</div>
	</div>
</template>

<script>
import rotatorStatus from './rotatorStatus.vue'

export default {
  name: 'status',
  data () {
    return {
      devices: [],
      loading: true
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      const vm = this
      vm.$http.get('/admin/status/overview').then(function (response) {
        vm.devices = response.data.devices
        vm.loading = false
      })
    }
  },
  components: {
    rotatorStatus
  }
}
</script>
