<template>
  <div class="row">
    <div class="col-md-12" v-if="!loading">
		<table class="table table-hover">
            <thead>
              <tr>
              	<th @click="sort('name')" scope="col" style="width: 20%; border-top: 0px; cursor: pointer;">Name&nbsp;
              		<i class="fa fa-long-arrow-down" v-if="currentSort === 'name' && currentSortDir === 'asc'"></i>
              		<i class="fa fa-long-arrow-up" v-if="currentSort === 'name' && currentSortDir === 'desc'"></i>
              	</th>
                <th @click="sort('nextPass')" scope="col" style="width: 20%; border-top: 0px; cursor: pointer;">Next pass&nbsp;
              		<i class="fa fa-long-arrow-down" v-if="currentSort === 'nextPass' && currentSortDir === 'asc'"></i>
              		<i class="fa fa-long-arrow-up" v-if="currentSort === 'nextPass' && currentSortDir === 'desc'"></i>
                </th>
                <th scope="col" style="width: 20%; border-top: 0px;">Frequency</th>
                <th scope="col" style="width: 10%; border-top: 0px;">Source</th>
                <th scope="col" style="width: 10%; border-top: 0px;">Enabled</th>
              </tr>
            </thead>
            <tbody>
              <tr :class="rowColor(curData)" :key="curData.id" v-for="(curData, index) in sortedSatellites">
              	<td><router-link :to="{ path: '/admin/satellite/load', query: { id: curData.id }}">{{ curData.name }}</router-link></td>
                <td>{{ curData.nextPassFormatted }}</td>
                <td>{{ curData.frequency }} hz</td>
                <td>
                	<span class="badge badge-secondary" v-if="curData.source === 'CONFIG'">r2cloud</span>
                	<span class="badge badge-success" v-if="curData.source === 'LEOSATDATA'">leosatdata</span>
                	<span class="badge badge-warning" v-if="curData.source === 'SATNOGS'">satnogs</span>
                </td>
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
      loading: true,
      currentSort: 'nextPass',
      currentSortDir: 'asc'
    }
  },
  mounted () {
    this.loadData()
  },
  computed:{
    sortedSatellites:function() {
      return this.satellites.sort((a,b) => {
        let modifier = 1;
        if(!a[this.currentSort] && !b[this.currentSort]) return 0;
        if(!a[this.currentSort] ) return 1;
        if(!b[this.currentSort]) return -1;
        if(this.currentSortDir === 'desc') modifier = -1;
        if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    }
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
    rowColor (scheduleDetails) {
      if (scheduleDetails.status === 'WEAK') {
        return 'table-warning'
      }
      return ''
    },    
    sort:function(s) {
      //if s == current sort, reverse
      if(s === this.currentSort) {
        this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
      }
      this.currentSort = s;
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
