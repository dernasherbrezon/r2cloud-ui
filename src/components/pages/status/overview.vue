<template>
	<div class="row" v-if="!loading">
		<div class="col-md-12" :key="curData.id" v-for="(curData, index) in devices">
		
			<div class="card border-success mb-3" v-if="curData.status === 'CONNECTED'">
				<div class="card-header text-success"><router-link :to="{ path: '/admin/device/config/load', query: { id: curData.id } }"><i class="fa fa-cog"></i></router-link>&nbsp;<router-link :to="{ path: '/admin/device/schedule', query: { id: curData.id } }">{{ curData.connection }}</router-link><deviceStatus :device="curData" /></div>
				<ul class="list-group list-group-flush text-success">
				    <li class="list-group-item" v-if="curData.model">Model: {{ curData.model }}</li>
					<li class="list-group-item">Frequencies: {{ curData.minFrequency / 1000000  }} - {{ curData.maxFrequency / 1000000 }} Mhz</li>
				</ul>
				<rotatorStatus :rotator="curData.rotator"/>
			</div>
			
			<div class="card border-danger mb-3" v-else-if="curData.status === 'FAILED'">
				<div class="card-header text-danger"><router-link :to="{ path: '/admin/device/config/load', query: { id: curData.id } }"><i class="fa fa-cog"></i></router-link>&nbsp;<router-link :to="{ path: '/admin/device/schedule', query: { id: curData.id } }">{{ curData.connection }}</router-link><deviceStatus :device="curData" /></div>
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
import deviceStatus from './deviceStatus.vue'

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
    rotatorStatus,
    deviceStatus
  }
}
</script>
