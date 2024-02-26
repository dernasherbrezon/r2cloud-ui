<template>
  <div class="row">
    <div class="col-md-12" v-if="!loading">
    	<h1 class="pb-2 mb-2 border-bottom">Devices</h1>
	      <b-alert variant="danger"
	        dismissible
	        :show="errors.has('general')">
	      {{ errors.first('general') }}
	      </b-alert>
    	<router-link class="btn btn-primary btn-sm" :to="{ path: '/admin/device/config/load'}">New</router-link>
    	<a class="btn btn-secondary btn-sm" href="#" v-on:click.prevent="deleteDevice" :class="checkedIds.length === 0 ? 'disabled' : ''">Delete</a>
    	<hr/>
		<table class="table table-hover">
            <thead>
              <tr>
                <th scope="col" style="border-top: 0px; width: 10px">&nbsp;</th>
              	<th scope="col" style="border-top: 0px; width: 60%">Name</th>
                <th scope="col" style="border-top: 0px;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr :class="rowColor(curData)" :key="curData.id" v-for="(curData, index) in devices">
                <td><input type="checkbox" name="id" :value="curData.id" v-model="checkedIds"></td>
          		<td><router-link :to="{ path: '/admin/device/config/load', query: { id: curData.id }}">{{ curData.name }}</router-link></td>
          		<td v-if="curData.status === 'CONNECTED'">{{ curData.status }}</td>
          		<td v-else-if="curData.status === 'FAILED'">{{ curData.failureMessage }}</td>
          		<td v-else></td>
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
export default {
  name: 'deviceList',
  data () {
    return {
      devices: [],
      checkedIds: [],
      loading: true
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    rowColor (device) {
      if (device.status === 'CONNECTED') {
        return 'table-success'
      }
      if (device.status === 'FAILED') {
        return 'table-danger'
      }
      return ''
    },
    loadData () {
      const vm = this
      vm.$http.get('/admin/device/config/list').then(function (response) {
        vm.devices = response.data
        vm.loading = false
      })
    },
    deleteDevice() {
      const vm = this
      vm.$http.post('/admin/device/config/delete', { ids: vm.checkedIds }).then(function (response) {
        vm.$router.push('/admin/restart')
      })
    }
  }
}
</script>
