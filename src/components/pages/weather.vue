<template>
  <div class="row">
    <div class="col-md-12" v-if="enabled && !loading">
      <b-tabs no-fade>
        <b-tab :title="item.name" :active="index === 0" :key="item.id" v-for="(item, index) in satellites">
          <div style="margin-top: 20px;">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col" style="width: 30%">Date</th>
                  <th scope="col">Has data</th>
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
                  <i class="fa fa-check" v-if="curData.aURL || curData.bURL"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-tab>
      </b-tabs>
    </div>
    <div class="col-md-12" v-else-if="!enabled && !loading">
      <div class="text-center">
      <p>Weather satellite tracking is not enabled. Please ensure you have proper antenna connected.<br>
      Once connect it, click "Enable" button below. You must agree with the terms and conditions</p>
      <form @submit.prevent="validateBeforeSubmit">
        <div class="form-check" :class="{'has-danger': errors.has('agreeWithToC') }">
          <label class="form-check-label" :class="{'is-invalid': errors.has('agreeWithToC') }">
            <input type="checkbox" name="agreeWithToC" class="form-check-input" v-model="agreeWithToC" v-validate="'required'"> Agree with <a href="/static/wxtoimgterms.txt" target="blank">Terms and Conditions</a>
          </label>
          <div class="invalid-feedback" v-if="errors.has('agreeWithToC')">{{ errors.first('agreeWithToC') }}</div>
        </div>
        <button type="submit" class="btn btn-default" :disabled="submitting">Enable</button>
      </form>
      </div>
    </div>
    <div class="col-md-12" style="text-align: center;" v-else-if="loading">
      <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>
      <span class="sr-only">Loading...</span>          
    </div>
  </div>
</template>

<script>

import moment from 'moment'

export default {
  name: 'weather',
  data () {
    return {
      satellites: [],
      enabled: true,
      agreeWithToC: false,
      submitting: false,
      loading: true
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    rowColor (observation) {
      if (observation.aURL && observation.aURL !== '' && observation.bURL && observation.bURL !== '') {
        return 'table-success'
      }
      return ''
    },
    loadData () {
      const vm = this
      vm.$http.get('/admin/weather').then(function (response) {
        vm.satellites = response.data.satellites
        vm.enabled = response.data.enabled
        vm.loading = false
      })
    },
    validateBeforeSubmit (e) {
      this.$validator.errors.clear()
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.submit()
        }
      })
    },
    submit (event) {
      if (this.submitting) {
        return
      }
      this.submitting = true
      this.log = []
      const vm = this
      vm.$http.post('/admin/config/weather', {
        agreeWithToC: vm.agreeWithToC
      }).then(function (response) {
        vm.submitting = false
        vm.loadData()
      }).catch(function (error) {
        vm.submitting = false
        vm.handleError(vm, error)
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