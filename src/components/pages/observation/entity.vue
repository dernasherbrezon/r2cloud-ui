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
          		<td><router-link :to="{ path: '/admin/observation/list', query: { satelliteId: observation.satellite, path: '/admin/observation/list' }}">{{ observation.satelliteName }}</router-link></td>
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
            <tr v-if="observation.device && observation.device.gain !== undefined">
              <td>Gain</td>
              <td>{{ observation.device.gain }}</td>
            </tr>
            <tr v-if="observation.device && observation.device.biast">
              <td>Bias-T</td>
              <td>{{ observation.device.biast }}</td>
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
              <td>Frames decoded</td>
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
            <tr v-if="observation.sigmfDataURL">
              <td>Download</td>
              <td><a :href="observation.sigmfDataURL" target="blank">SigMF data</a><br/><a :href="observation.sigmfMetaURL" target="blank">SigMF meta</a></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-md-8">
          <b-tabs no-fade>
          	<b-tab title="Image" v-if="observation.aURL || observation.instruments">
              <div class="row" style="margin-top: 20px;" v-if="observation.aURL">
                <div class="col-md-12">
                  <img class="img-fluid" :src="observation.aURL">
                </div>
              </div>
              <div class="row" style="margin-top: 20px;" v-else>
                <div class="col-md-12">
                  <form>
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="instrument">Instrument</label>
                        <select v-model="selectedInstrumentId" class="form-control" id="instrument" @change="onInstrumentChange()" aria-describedby="instrumentHelp">
                          <option v-for="cur in observation.instruments" :key="cur.id" :value="cur.id">{{ cur.name }}</option>
                        </select>
                        <small id="instrumentHelp" class="form-text text-muted">
                          {{ selectedInstrument.description }}
                        </small>
                      </div>
                      <div class="form-group col-md-6">
                        <label for="channel">Channel</label>
                        <select v-model="selectedChannelId" class="form-control" id="channel" @change="onChannelChange" aria-describedby="channelHelp">
                          <option value="combo">Combined</option>
                          <option disabled v-if="selectedInstrument.channels">──────────</option>
                          <option v-for="cur in selectedInstrument.channels" :key="cur.id" :value="cur.id">{{ cur.id }}</option>
                        </select>
                        <small id="channelHelp" class="form-text text-muted">
                          {{ selectedChannel.description }}
                        </small>
                      </div>
                    </div>
                    <div class="form-row">
                      <img class="img-fluid" width="100%" :src="selectedChannel.imageURL">
                    </div>
                  </form>
                </div>
              </div>
          	</b-tab>
            <b-tab title="Telemetry" v-if="observation.dataEntity">
              <div class="row" style="margin-top: 20px;">
                <div class="col-md-12" role="tablist">
                  <b-card no-body class="mb-1" v-for="(curBeacon, index) in observation.dataEntity" :key="curBeacon.name">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-btn href="#" v-b-toggle="'accordion-' + index" variant="default">Time: {{ formatTimeBeacon(curBeacon.time) }} <span v-if="curBeacon.rssi">RSSI: {{ curBeacon.rssi }} SNR: {{ curBeacon.snr }}</span></b-btn>
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
            <b-tab title="Spectogram" v-if="observation.spectogramURL || observation.rawURL">
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
			<b-tab title="Polar Plot">
				<div class="row" style="margin-top: 20px;" v-if="observation.tle">
					<div class="col-md-12">
						<azelchart id="radarChart" width="400" :chartData="chartData"></azelchart>
					</div>
				</div>
			</b-tab>
            <b-tab title="TLE">
              <div class="row" style="margin-top: 20px;" v-if="observation.tle">
                <div class="col-md-12">
	              			<form>
								<div class="row">
									<div class="col-md-12">
										<div class="form-group">
											<textarea class="form-control" id="tleValue" disabled rows="3">{{ observation.tle.line1 }}
{{ observation.tle.line2 }}
{{ observation.tle.line3 }}</textarea>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-md-4">
										<div class="form-group">
											<label for="tleSource">Source</label>
											<input class="form-control" id="tleSource" disabled :value="observation.tle.source">
										</div>
									</div>
									<div class="col-md-4">
										<div class="form-group" v-if="observation.tleStatus == 'OLD'">
											<label for="tleCalculated">Calculated (epoch)</label>
											<input class="form-control is-invalid" id="tleCalculated" disabled :value="formatTime(observation.tleUnixTime) + ' ' + formatDate(observation.tleUnixTime)">
											<div class="invalid-feedback">Older than 14 days</div>
										</div>
										<div class="form-group" v-else>
											<label for="tleCalculated">Calculated (epoch)</label>
											<input class="form-control" id="tleCalculated" disabled :value="formatTime(observation.tleUnixTime) + ' ' + formatDate(observation.tleUnixTime)">
										</div>
									</div>
									<div class="col-md-4">
										<div class="form-group">
											<label for="tleDownloaded">Downloaded</label>
											<input class="form-control" id="tleDownloaded" disabled :value="formatTime(observation.tle.updated) + ' ' + formatDate(observation.tle.updated)">
										</div>
									</div>
								</div>
							</form>
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
import * as satellite from 'satellite.js'
import azelchart from '@/components/AzElChart.vue'

export default {
  name: 'observationLoad',
  components: {azelchart},
  data () {
    return {
      observation: {},
      loading: true,
      generatingSpectogram: false,
      chartData: [],
      selectedInstrumentId: '',
      selectedInstrument: {},
      selectedChannel: {},
      selectedChannelId: ''
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    onInstrumentChange() {
      this.selectedInstrument = this.observation.instruments.find(item => item.id === this.selectedInstrumentId);
      this.selectedChannel = {
        id: "combo",
        imageURL: this.selectedInstrument.combinedImageURL,
        description: "Combined image from some channels"
      }; 
      this.selectedChannelId = this.selectedChannel.id;
    },
    onChannelChange() {
      if( this.selectedChannelId === "combo" ) {
        this.selectedChannel = {
          id: "combo",
          imageURL: this.selectedInstrument.combinedImageURL,
          description: "Combined image from some channels"
        };
        return;
      }
      this.selectedChannel = this.selectedInstrument.channels.find(item => item.id === this.selectedChannelId);
    },
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
            vm.errors.add('general', 'Unable to find IQ file with raw data')
          })
          return
        }
        vm.handleError(vm, error)
      })
    },
    loadData () {
      const vm = this
      vm.$http.get(vm.$route.query.path + '?id=' + vm.$route.query.id + '&satelliteId=' + vm.$route.query.satelliteId).then(function (response) {
        vm.observation = response.data
        var satrec = satellite.twoline2satrec(vm.observation.tle.line2, vm.observation.tle.line3)
        vm.observation.tleUnixTime = (satrec.jdsatepoch - 2440587.5) * 86400000;
		var diff = Math.abs(vm.observation.tle.updated - vm.observation.tleUnixTime);
		if (diff < 7 * 24 * 60 * 60 * 1000) {
			vm.observation.tleStatus = 'GOOD'
		} else if (diff < 14 * 24 * 60 * 60 * 1000) {
			vm.observation.tleStatus = 'STALE'
		} else {
			vm.observation.tleStatus = 'OLD'
		}
		if( vm.observation.instruments ) {
			vm.selectedInstrument = vm.observation.instruments.find(item => item && item.primary);
			if( vm.selectedInstrument ) {
				vm.selectedInstrumentId = vm.selectedInstrument.id;
				vm.onInstrumentChange();
			}
		}
        vm.loading = false
        vm.generatePolarPlot(satrec)
      }).catch(function (error) {
        vm.loading = false
        vm.handleError(vm, error)
      })
    },
    generatePolarPlot(satrec) {
      const vm = this
      var observerGd = {
        longitude: vm.observation.groundStation.lon * Math.PI / 180.0,
        latitude: vm.observation.groundStation.lat * Math.PI / 180.0,
        height: 0
      }
      var azelData = []
      for (var t = moment(vm.observation.start); t < moment(vm.observation.end); t.add(20, 's')) {
        var skyPosition = vm.polarGetAzEl(satrec, observerGd, t);
        if(  skyPosition.elevation < 0 ) {
            skyPosition.elevation = 0
        }
        azelData.push({x: skyPosition.azimuth.toFixed(2), y: skyPosition.elevation.toFixed(2), time: t.utc().format('HH:mm:ss')})
      }
      vm.chartData = azelData
    },
    polarGetAzEl(satrec, observerGd, t) {
        var positionAndVelocity = satellite.propagate(satrec, t.toDate())

        var gmst = satellite.gstime(t.toDate())
        var positionEci   = positionAndVelocity.position
        var positionEcf   = satellite.eciToEcf(positionEci, gmst)

        var lookAngles    = satellite.ecfToLookAngles(observerGd, positionEcf)

        return {'azimuth':   lookAngles.azimuth * 180 / Math.PI,
            'elevation': lookAngles.elevation * 180 / Math.PI}
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
    },
    formatTimeBeacon (unixTimestamp) {
      if (unixTimestamp) {
        return moment(unixTimestamp).utc().format('HH:mm:ss')
      }
      return ''
    }
  }
}
</script>