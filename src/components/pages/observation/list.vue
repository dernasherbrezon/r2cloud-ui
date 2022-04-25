<template>
  <div class="row">
    <div class="col-md-12" v-if="!loading">
		<table class="table table-hover">
            <thead>
              <tr>
              	<th scope="col" style="border-top: 0px; width: 30%">Name</th>
                <th scope="col" style="border-top: 0px; width: 30%">Date</th>
                <th scope="col" style="border-top: 0px;">Frames</th>
              </tr>
            </thead>
            <tbody>
              <tr :class="rowColor(curData)" :key="curData.id" v-for="(curData, index) in observations">
              	<template v-if="curData.status == 'RECEIVING_DATA'">
              		<td>{{ curData.name }}</td>
              		<td colspan="2">
						<div class="progress" style="height: 20px;">
						  <div class="progress-bar progress-bar-animated" role="progressbar" :style="'width: ' + formatReceive(curData) + '%'" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
						  	<span>{{ formatReceive(curData) }} %</span>
						  </div>
						</div>            
              		</td>
              	</template>
              	<template v-else-if="curData.status == 'RECEIVED'">
              		<td>{{ curData.name }}</td>
              		<td colspan="2">
						<div class="progress" style="height: 20px;">
						  <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 100%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
						  	<span>Decoding...</span>
						  </div>
						</div>            
              		</td>	
              	</template>
              	<template v-else>
	              	<td>{{ curData.name }}</td>
	                <td><router-link :to="{ path: '/admin/observation/load', query: { id: curData.id, satelliteId: curData.satelliteId, path: '/admin/observation/load' }}">{{ formatTime(curData.start) + ' ' + formatDate(curData.start) }}</router-link></td>
	                <td>{{ curData.numberOfDecodedPackets }}</td>
              	</template>
              </tr>
            </tbody>
         </table>      
    </div>
    <div class="col-md-12" style="text-align: center;" v-else>
      <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>
      <span class="sr-only">Loading...</span>          
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'observationList',
  data () {
    return {
      observations: [],
      loading: true,
      timeoutFunction: ''
    }
  },
  mounted () {
    this.loadData()
    this.timeoutFunction = setTimeout(this.reloadData, 10000);
  },
  unmounted() {
    if( this.timeoutFunction !== '' ) {
      clearTimeout(this.timeoutFunction)
    }
  },
  beforeRouteLeave (to, from, next) {
    clearTimeout(this.timeoutFunction)
    next()
  },
  methods: {
    formatReceive(observation) {
      return Math.round((moment().utc().valueOf() - observation.start) * 100 / (observation.end - observation.start));
    },
    rowColor (observation) {
      if (observation.hasData) {
        return 'table-success'
      }
      return ''
    },
    formatDate (unixTimestamp) {
      return moment(unixTimestamp).utc().format('DD-MMM-YYYY')
    },
    formatTime (unixTimestamp) {
      return moment(unixTimestamp).utc().format('HH:mm')
    },
    reloadData() {
      this.loadData()
      this.timeoutFunction = setTimeout(this.reloadData, 10000)
    },
    loadData () {
      const vm = this
      vm.$http.get('/admin/observation/list').then(function (response) {
        vm.observations = response.data
        vm.loading = false
      })
    }
  }
}
</script>
