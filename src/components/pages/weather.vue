<template>
  <div class="row">
    <div class="col-md-12" v-if="enabled">
      <b-tabs no-fade>
        <b-tab :title="item.name" :active="index === 0" :key="item.id" v-for="(item, index) in satellites">
          <div style="margin-top: 20px;">
            <p>Next pass: <strong>{{ formatTime(item.nextPass) }}</strong> {{ formatDate(item.nextPass) }} UTC</p>
            <b-tabs pills no-fade>
              <b-tab :title="formatTime(curData.date) + ' ' + formatDate(curData.date)" :key="curData.date" :active="curDataIndex === 0" v-for="(curData,curDataIndex) in item.data">
                <div class="row" style="margin-top: 20px;">
                  <div class="col-md-6">
                      <img class="img-fluid" :src="curData.aPath">
                  </div>
                  <div class="col-md-6">
                      <img class="img-fluid" :src="curData.bPath">
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </div>
        </b-tab>
      </b-tabs>
    </div>
    <div class="col-md-12" v-else>
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
      submitting: false
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      const vm = this
      vm.$http.get('/admin/weather').then(function (response) {
        vm.satellites = response.data.satellites
        vm.enabled = response.data.enabled
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