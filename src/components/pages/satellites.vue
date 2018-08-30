<template>
    <b-tabs no-fade>
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
</template>

<script>
import moment from 'moment'

export default {
  name: 'satellites',
  props: ['satellites'],
  methods: {
    rowColor (observation) {
      if ((observation.aURL && observation.aURL !== '') || (observation.data && observation.data !== '')) {
        return 'table-success'
      }
      return ''
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