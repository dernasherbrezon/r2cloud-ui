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
          	<tr v-if="observation.tle">
          		<td>Satellite</td>
          		<td>{{ observation.tle.line1 }}</td>
          	</tr>
          	<tr>
          		<td>NORAD id</td>
          		<td>{{ observation.satellite }}</td>
          	</tr>
            <tr>
              <td>Start</td>
              <td>{{ formatTime(observation.start) + ' ' + formatDate(observation.start) }}</td>
            </tr>
            <tr>
              <td>End</td>
              <td>{{ formatTime(observation.end) + ' ' + formatDate(observation.end) }}</td>
            </tr>
            <tr v-if="observation.gain">
              <td>Gain</td>
              <td>{{ observation.gain }}</td>
            </tr>
            <tr v-if="observation.biast">
              <td>Bias-T</td>
              <td>{{ observation.biast }}</td>
            </tr>            
            <tr v-if="observation.channelA">
              <td>Channel A</td>
              <td>{{ observation.channelA  }}</td>
            </tr>
            <tr v-if="observation.channelB">
              <td>Channel B</td>
              <td>{{ observation.channelB  }}</td>
            </tr>
            <tr v-if="observation.numberOfDecodedPackets">
              <td>Number of packets</td>
              <td>{{ observation.numberOfDecodedPackets  }}</td>
            </tr>
            <tr v-if="observation.frequency > 0">
              <td>Frequency</td>
              <td>{{ observation.frequency  }}</td>
            </tr>
            <tr v-if="observation.actualFrequency > 0">
              <td>Actual frequency</td>
              <td>{{ observation.actualFrequency  }}</td>
            </tr>
            <tr v-if="observation.sampleRate > 0">
              <td>Sample rate</td>
              <td>{{ observation.sampleRate  }}</td>
            </tr>
            <tr v-if="observation.bandwidth > 0">
              <td>Bandwidth</td>
              <td>{{ observation.bandwidth  }}</td>
            </tr>
            <tr v-if="observation.rawURL">
              <td>Download</td>
              <td><i class="fa fa-download" aria-hidden="true"></i>&nbsp;<a :href="observation.rawURL" target="blank">Raw file</a></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-md-8">
          <b-tabs no-fade>
          	<b-tab title="Image" v-if="observation.aURL">
              <div class="row" style="margin-top: 20px;">
                <div class="col-md-12">
                  <img class="img-fluid" :src="observation.aURL">
                </div>
              </div>
          	</b-tab>
            <b-tab title="Telemetry" v-if="observation.dataEntity">
              <div class="row" style="margin-top: 20px;">
                <div class="col-md-12" role="tablist">
                  <b-card no-body class="mb-1" v-for="(curBeacon, index) in observation.dataEntity" :key="curBeacon.name">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-btn href="#" v-b-toggle="'accordion-' + index" variant="default">Uptime: {{ curBeacon.name }}</b-btn>
                    </b-card-header>
                    <b-collapse :id="'accordion-' + index" accordion="accordion" role="tabpanel">
                      <b-card-body>
                        <pre>
{{ curBeacon.body }}
                        </pre>
                      </b-card-body>
                    </b-collapse>
                  </b-card>                  
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

            <b-tab title="TLE">
              <div class="row" style="margin-top: 20px;" v-if="observation.tle">
                <div class="col-md-12">
                  <p>{{ observation.tle.line1 }}</p>
				  <p>{{ observation.tle.line2 }}</p>
				  <p>{{ observation.tle.line3 }}</p>
                </div>
              </div>
              <div class="row" style="margin-top: 20px;" v-else>
                <div class="col-md-12 text-center" style="margin-top: 10%">
                  <i class="fa fa-times"></i>&nbsp;No Data
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
  name: 'observationLoad',
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
      vm.$http.post('/admin/observation/spectogram', {
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
      vm.$http.get('/admin/observation/load?id=' + vm.$route.query.id + '&satelliteId=' + vm.$route.query.satelliteId).then(function (response) {
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