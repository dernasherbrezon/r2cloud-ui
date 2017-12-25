<template>
  <div>
    <div class="row" v-if="!loading">
      <div class="col-md-4">
        <table class="table">
          <thead>
            <tr>
              <th colspan="2">Meta</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Start</td>
              <td>{{ formatTime(observation.start) + ' ' + formatDate(observation.start) }}</td>
            </tr>
            <tr>
              <td>End</td>
              <td>{{ formatTime(observation.end) + ' ' + formatDate(observation.end) }}</td>
            </tr>
            <tr>
              <td>Gain</td>
              <td>{{ observation.gain }}</td>
            </tr>
            <tr>
              <td>Channel A</td>
              <td>{{ observation.channelA  }}</td>
            </tr>
            <tr>
              <td>Channel B</td>
              <td>{{ observation.channelB  }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-md-8">
          <b-tabs no-fade>
            <b-tab title="Data">
              <div class="row" style="margin-top: 20px;" v-if="observation.aURL || observation.bURL">
                <div class="col-md-6">
                  <img class="img-fluid" :src="observation.aURL">
                </div>
                <div class="col-md-6">
                  <img class="img-fluid" :src="observation.bURL">
                </div>
              </div>
              <div class="row" style="margin-top: 20px;" v-else>
                <div class="col-md-12 text-center" style="margin-top: 10%">
                  <i class="fa fa-times"></i>&nbsp;No Data
                </div>
              </div>
            </b-tab>
            <b-tab title="Spectogram">
              <div class="row" style="margin-top: 20px;" v-if="observation.spectogramURL && !generatingSpectogram">
                <div class="col-md-12">
                  <img class="img-fluid" :src="observation.spectogramURL">
                </div>
              </div>
              <div class="row" style="margin-top: 20px;" v-else>
                <div class="col-md-12 text-center" style="margin-top: 10%" v-if="!generatingSpectogram && !errors.has('general')">
                  <button class="btn btn-default" v-on:click="debug"><i class="fa fa-refresh"></i>&nbsp;Generate</button>
                </div>                
                <div class="col-md-12" style="text-align: center;" v-else-if="generatingSpectogram">
                  <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>
                  <span class="sr-only">Generating...</span>          
                </div>
                <div class="col-md-12" style="text-align: center;" v-else-if="errors.has('general')">
                  <p class="text-danger">
                  {{ errors.first('general') }}
                  </p>
                </div>
              </div>
            </b-tab>
          </b-tabs>
      </div>
    </div>
    <div class="col-md-12" style="text-align: center;" v-else="loading">
      <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>
      <span class="sr-only">Loading...</span>          
    </div>
  </div>
</template>

<script>

import moment from 'moment'

export default {
  name: 'weatherObservation',
  data () {
    return {
      observation: {},
      loading: true,
      generatingSpectogram: false
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    debug () {
      const vm = this
      vm.generatingSpectogram = true
      vm.$http.post('/admin/weather/spectogram', {
        id: vm.$route.query.id,
        satelliteId: vm.$route.query.satelliteId
      }).then(function (response) {
        vm.generatingSpectogram = false
        vm.observation.spectogramURL = response.data.spectogramURL
      }).catch(function (error) {
        vm.generatingSpectogram = false
        if (error.response && error.response.status === 404) {
          vm.$validator.validate().then(() => {
            vm.errors.add('general', 'Unable to find .wav')
          })
          return
        }
        vm.handleError(vm, error)
      })
    },
    loadData () {
      const vm = this
      vm.$http.get('/admin/weather/observation?id=' + vm.$route.query.id + '&satelliteId=' + vm.$route.query.satelliteId).then(function (response) {
        vm.observation = response.data
        vm.loading = false
      }).catch(function (error) {
        vm.loading = false
        vm.handleError(vm, error)
      })
    },
    formatDate (unixTimestamp) {
      if (unixTimestamp) {
        return moment(unixTimestamp).utc().format('DD-MMM-YYYY')
      }
      return ''
    },
    formatTime (unixTimestamp) {
      if (unixTimestamp) {
        return moment(unixTimestamp).utc().format('HH:mm')
      }
      return ''
    }
  }
}
</script>