<template>
  <div class="row">
    <div class="col-md-12" v-if="!loading">
		<table class="table table-hover">
            <thead>
              <tr>
              	<th scope="col" style="width: 20%; border-top: 0px;">Name</th>
                <th scope="col" style="width: 20%; border-top: 0px;">Next pass</th>
                <th scope="col" style="width: 20%; border-top: 0px;">Frequency</th>
                <th scope="col" style="width: 20%; border-top: 0px;">Enabled</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="curData.id" v-for="(curData, index) in satellites">
              	<td>{{ curData.name }}</td>
                <td>{{ curData.nextPassFormatted }}</td>
                <td>{{ curData.frequency }} hz</td>
                <td>
                	<input type="checkbox" v-model="curData.enabled" @change="check(curData, index)">
                </td>
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
  name: 'scheduleList',
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
    check (element, index) {
      const vm = this
      vm.$http.post('/admin/schedule/save', {
        id: element.id,
        enabled: element.enabled
      }).then(function (response) {
        response.data.nextPassFormatted = vm.format(response.data.nextPass)
        vm.satellites.splice(index, 1, response.data)
      }).catch(function (error) {
        vm.handleError(vm, error)
      })
    },
    format (unixTimestamp) {
      if (unixTimestamp) {
        var utcTime = moment(unixTimestamp).utc()
        return utcTime.format('DD-MMM-YYYY') + ' ' + utcTime.format('HH:mm')
      }
    },
    loadData () {
      const vm = this
      vm.$http.get('/admin/schedule/list').then(function (response) {
        var arrayLength = response.data.length
        for (var i = 0; i < arrayLength; i++) {
          response.data[i].nextPassFormatted = vm.format(response.data[i].nextPass)
        }
        vm.satellites = response.data
        vm.loading = false
      })
    }
  }
}
</script>
