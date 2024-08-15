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
         <div style="text-align: center;" v-if="haveMore">
         	<button class="btn btn-secondary" v-on:click="this.loadData">More</button>
         	<br/>
         	<br/>
         </div>   
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
      haveMore: true,
      cursor: ""
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    formatReceive(observation) {
      return Math.round((observation.currentTime - observation.start) * 100 / (observation.end - observation.start));
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
    loadData () {
      const vm = this
      var satelliteId = ''
      if( vm.$route.query.satelliteId ) {
        satelliteId = vm.$route.query.satelliteId
      }
      vm.$http.get('/admin/observation/list?limit=12&cursor=' + vm.cursor + '&satelliteId=' + satelliteId).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          vm.observations.push(response.data[i])
        }
        if( response.data.length === 0 ) {
          vm.haveMore = false
        } else {
          vm.cursor = response.data[response.data.length - 1].id
        }
        vm.loading = false
      }).catch(function (error) {
        vm.loading = false
        vm.handleError(vm, error)
      })
    }
  }
}
</script>
