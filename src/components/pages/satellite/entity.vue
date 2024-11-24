<template>
  <div class="row">
    <div class="col-md-12">
      <h1 class="pb-2 mb-2 border-bottom">{{ entity.name }}</h1>
      <form>
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="source">Source</label>
              <input class="form-control" id="source" disabled :value="'R2CLOUD'" v-if="entity.source === 'CONFIG'">
              <input class="form-control" id="source" disabled :value="entity.source" v-else>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="lastUpdateTime">Last updated</label>
              <input class="form-control" id="lastUpdateTime" disabled :value="formatTime(entity.lastUpdateTime) + ' ' + formatDate(entity.lastUpdateTime)">
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="col-md-12">
      <h2>TLE</h2>
      <form>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <textarea class="form-control" id="tleValue" disabled rows="3">{{ entity.tle.line1 }}
{{ entity.tle.line2 }}
{{ entity.tle.line3 }}</textarea>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="tleSource">Source</label>
              <input class="form-control" id="tleSource" disabled :value="entity.tle.source">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group" v-if="entity.tleStatus == 'OLD'">
              <label for="tleCalculated">Calculated (epoch)</label>
              <input class="form-control is-invalid" id="tleCalculated" disabled :value="formatTime(entity.tleUnixTime) + ' ' + formatDate(entity.tleUnixTime)">
              <div class="invalid-feedback">Older than 14 days</div>
            </div>
            <div class="form-group" v-else>
              <label for="tleCalculated">Calculated (epoch)</label>
              <input class="form-control" id="tleCalculated" disabled :value="formatTime(entity.tleUnixTime) + ' ' + formatDate(entity.tleUnixTime)">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="tleDownloaded">Downloaded</label>
              <input class="form-control" id="tleDownloaded" disabled :value="formatTime(entity.tle.updated) + ' ' + formatDate(entity.tle.updated)">
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="col-md-12">
      <h2>Transmitters</h2>
      <form :key="curData.frequency" v-for="(curData, index) in entity.transmitters">
        <div class="row">
          <div class="col-md-4" v-if="curData.status == 'ENABLED' || curData.status == 'WEAK'">
            <div class="form-group">
              <label for="framing">Framing</label>
              <input class="form-control is-valid" id="framing" disabled :value="curData.framing">
            </div>
          </div>
          <div class="col-md-4" v-else>
            <div class="form-group">
              <label for="framing">Framing</label>
              <input class="form-control is-invalid" id="framing" disabled :value="curData.framing">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="modulation">Modulation</label>
              <input class="form-control" id="modulation" disabled :value="curData.modulation">
            </div>
          </div>
          <div class="col-md-4">
            <label for="frequency">Frequency</label>
            <div class="input-group md-4">
              <input type="text" disabled class="form-control" v-model.number="curData.frequency">
              <div class="input-group-append">
                <span class="input-group-text" id="basic-addon2">Hz</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
          </div>
          <div class="col-md-8">
            <table class="table" v-if="curData.modulation == 'LORA'">
              <tbody>
                <tr>
                  <td style="width: 25%">Bandwidth (BW)</td>
                  <td>{{ curData.loraBandwidth }} hz</td>
                </tr>
                <tr>
                  <td>Spread factor (SF)</td>
                  <td>{{ curData.loraSpreadFactor }}</td>
                </tr>
                <tr>
                  <td>Coding rate (CR)</td>
                  <td>{{ curData.loraCodingRate }}</td>
                </tr>
                <tr>
                  <td>Syncwod</td>
                  <td>{{ curData.loraSyncword }}</td>
                </tr>
                <tr>
                  <td>Preamble length</td>
                  <td>{{ curData.loraPreambleLength }}</td>
                </tr>
                <tr>
                  <td>Low data rate optimization (LDRO)</td>
                  <td>{{ curData.loraLdro }}</td>
                </tr>
                <tr>
                  <td>Explicit header</td>
                  <td>{{ curData.loraExplicitHeader }}</td>
                </tr>
                <tr>
                  <td>CRC</td>
                  <td>{{ curData.loraCrc }}</td>
                </tr>
              </tbody>
            </table>
            <table class="table" v-else>
              <tbody>
                <tr>
                  <td style="width: 25%">Bandwidth</td>
                  <td>{{ curData.bandwidth }} hz</td>
                </tr>
                <tr v-if="curData.baudRates.length > 0">
                  <td>Baud rates</td>
                  <td>{{ formatList(curData.baudRates) }}</td>
                </tr>
                <tr v-if="curData.modulation == 'GFSK' && curData.deviation">
                  <td>Deviation</td>
                  <td>{{ curData.deviation }}</td>
                </tr>
                <tr v-if="curData.modulation == 'BPSK' && curData.bpskCenterFrequency">
                  <td>Offset</td>
                  <td>{{ curData.bpskCenterFrequency }}</td>
                </tr>
                <tr v-if="curData.modulation == 'BPSK' && curData.bpskDifferential">
                  <td>Differential</td>
                  <td>{{ curData.bpskDifferential }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <hr/>
      </form>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import * as satellite from 'satellite.js'

export default {
  name: 'general',
  data() {
    return { 
      entity: {
        tle: {}
      }
    }
  },
  mounted () {
    const vm = this
    vm.$http.get('/admin/satellite/load', { params: { id: vm.$route.query.id } } ).then(function (response) {
      vm.entity = response.data
        var satrec = satellite.twoline2satrec(vm.entity.tle.line2, vm.entity.tle.line3)
        vm.entity.tleUnixTime = (satrec.jdsatepoch - 2440587.5) * 86400000;
        var diff = Math.abs(vm.entity.tle.updated - vm.entity.tleUnixTime);
        if (diff < 7 * 24 * 60 * 60 * 1000) {
          vm.entity.tleStatus = 'GOOD'
        } else if (diff < 14 * 24 * 60 * 60 * 1000) {
          vm.entity.tleStatus = 'STALE'
        } else {
          vm.entity.tleStatus = 'OLD'
        }
    })
  },
  methods: {
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
    formatList (list) {
      return list.join(', ')
    }
  }
}
</script>
