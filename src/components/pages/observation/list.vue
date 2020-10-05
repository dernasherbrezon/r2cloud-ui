<template>
  <div class="row">
    <div class="col-md-12" v-if="!loading">
		<table class="table table-hover">
            <thead>
              <tr>
              	<th scope="col" style="border-top: 0px;">Name</th>
                <th scope="col" style="border-top: 0px;">Date</th>
                <th scope="col" style="border-top: 0px;">Frames</th>
              </tr>
            </thead>
            <tbody>
              <tr :class="rowColor(curData)" :key="curData.id" v-for="(curData, index) in observations">
              	<td>{{ curData.name }}</td>
                <td><router-link :to="{ path: '/admin/observation/load', query: { id: curData.id, satelliteId: curData.satelliteId }}">{{ formatTime(curData.start) + ' ' + formatDate(curData.start) }}</router-link></td>
                <td>{{ curData.numberOfDecodedPackets }}</td>
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
      loading: true
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
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
      vm.$http.get('/admin/observation/list').then(function (response) {
        vm.observations = response.data
        vm.loading = false
      })
    }
  }
}
</script>
