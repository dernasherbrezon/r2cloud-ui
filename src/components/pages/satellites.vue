<template>
    <b-tabs no-fade v-if="!loading">
      <b-tab :title="item.name" :active="index === 0" :key="item.id" v-for="(item, index) in satellites">
        <div>
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col" style="width: 30%; border-top: 0px;">Date</th>
                <th scope="col" style="border-top: 0px;">Has data</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Next pass: <strong>{{ formatTime(item.nextPass) }}</strong> {{ formatDate(item.nextPass) }} UTC</td>
                <td></td>
              </tr>
              <tr :class="rowColor(curData)" v-for="(curData, curDataIndex) in item.data" :key="curData.id">
                <td><router-link :to="{ path: '/admin/weather/observation', query: { id: curData.id, satelliteId: item.id }}">{{ formatTime(curData.start) + ' ' + formatDate(curData.start) }}</router-link></td>
                <td>
                <i class="fa fa-check" v-if="curData.aURL || curData.data"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-tab>
    </b-tabs>
    <div style="text-align: center;" v-else>
      <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>
      <span class="sr-only">Loading...</span>          
    </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'satellites',
  props: ['url'],
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
    rowColor (observation) {
      if ((observation.aURL && observation.aURL !== '') || (observation.data && observation.data !== '')) {
        return 'table-success'
      }
      return ''
    },
    loadData () {
      const vm = this
      vm.$http.get(vm.url).then(function (response) {
        vm.satellites = response.data.satellites
        vm.loading = false
      })
    },
    formatDate (unixTimestamp) {
      return moment(unixTimestamp).utc().format('DD-MMM-YYYY')
    },
    formatTime (unixTimestamp) {
      return moment(unixTimestamp).utc().format('HH:mm')
    }
  }
}
</script>

<style>
.form-check-label.is-invalid {
  color: #dc3545;
}
.form-check-label.is-invalid ~ .invalid-feedback {
  display: block;
}
</style>