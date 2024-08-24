<template>
  <div class="row">
    <div class="col-md-12">
      <h1 class="pb-2 mb-2 border-bottom">General configuration</h1>
      <b-alert variant="danger"
        dismissible
        :show="errors.has('general')">
      {{ errors.first('general') }}
      </b-alert>
    </div>
    <div class="col-md-12">
      <form style="margin-top: 20px;" @submit.prevent="validateBeforeSubmit">
        <div class="row">
          <div class="col-md-4">
            <div class="form-group" :class="{'has-danger': errors.has('lat') }">
              <label for="lat">Latitude</label>
              <input type="text" id="lat" name="lat" :class="{'is-invalid': errors.has('lat') }" :disabled="entity.locationAuto" v-validate="'required|decimal'" class="form-control" v-model.number="entity.lat">
              <div class="invalid-feedback" v-if="errors.has('lat')">{{ errors.first('lat') }}</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group" :class="{'has-danger': errors.has('lng') }">
              <label for="lng">Longitude</label>
              <input type="text" id="lng" name="lng" :class="{'is-invalid': errors.has('lng') }" :disabled="entity.locationAuto" v-validate="'required|decimal'" class="form-control" v-model.number="entity.lng">
              <div class="invalid-feedback" v-if="errors.has('lng')">{{ errors.first('lng') }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="form-group" :class="{'has-danger': errors.has('alt') }">
              <label for="alt">Altitude</label>
              <input type="text" id="alt" name="alt" :class="{'is-invalid': errors.has('alt') }" :disabled="entity.locationAuto" v-validate="'decimal'" class="form-control" v-model.number="entity.alt">
              <div class="invalid-feedback" v-if="errors.has('alt')">{{ errors.first('alt') }}</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
                <label for="detect">&nbsp;</label>
                <button id="detect" type="button" class="btn btn-light" :disabled="entity.locationAuto" v-on:click="detectLocation" style="display: block;">Detect from Browser</button>
            </div>
          </div>
        </div>
        <div class="form-group">
	        <div class="form-check">
	            <input class="form-check-input" type="checkbox" id="locationAuto" v-model="entity.locationAuto">
	            <label class="form-check-label" for="locationAuto"> Use GPS</label>
                <small id="locationAutoHelp" class="form-text text-muted">
         	      	Use connected GPS devices to automatically determine location on the startup. Currently supported Linux and <a href="https://gpsd.gitlab.io/gpsd/index.html" target="blank">GPSD</a>.
                </small>
	        </div>
        </div>
        <hr/>
        <div class="row">
          <div class="col-md-4">
              <label for="retentionMaxSizeBytes">Retention</label>
              <div class="input-group md-4">
                  <input type="number" step="0.001" id="retentionMaxSizeBytes" name="retentionMaxSizeBytes" :class="{'is-invalid': errors.has('retentionMaxSizeBytes') }" v-validate="'required|decimal'" class="form-control" v-model.number="entity.retentionMaxSizeBytes">
                  <div class="input-group-append">
                      <span class="input-group-text" id="basic-addon2">GiB</span>
                  </div>
                  <div class="invalid-feedback" v-if="errors.has('retentionMaxSizeBytes')">{{ errors.first('retentionMaxSizeBytes') }}</div>
              </div>              
              <small id="retentionMaxSizeBytesHelp" class="form-text text-muted">
         	    Amount of disk space r2cloud will occupy with observation's data. This includes raw I/Q files, decoded data, meta information &etc.
              </small>
          </div>
          <div class="col-md-4">
            <div class="form-group" :class="{'has-danger': errors.has('retentionRawCount') }">
              <label for="retentionRawCount">Max I/Q files</label>
              <input type="text" id="retentionRawCount" name="retentionRawCount" :class="{'is-invalid': errors.has('retentionRawCount') }" v-validate="'required|decimal'" class="form-control" v-model.number="entity.retentionRawCount">
              <div class="invalid-feedback" v-if="errors.has('retentionRawCount')">{{ errors.first('retentionRawCount') }}</div>
              <small id="retentionRawCountHelp" class="form-text text-muted">
              	Number of raw I/Q files to keep. They can be used for manual processing and analysis. They are the biggest disk space consumers.
              </small>
            </div>
          </div>
        </div>
        <hr/>
        <div class="form-group">
	        <div class="form-check">
	            <input class="form-check-input" type="checkbox" id="gridCheck" v-model="entity.autoUpdate">
	            <label class="form-check-label" for="gridCheck"> Auto-update enabled</label>
	        </div>
        </div>
        <hr/>
        <div class="form-group">
	        <div class="form-check">
	            <input class="form-check-input" type="checkbox" id="presentationMode" v-model="entity.presentationMode">
	            <label class="form-check-label" for="presentationMode"> Presentation mode enabled</label>
				<small id="presentationModeHelp" class="form-text text-muted">
				  	This will allow access to the following data WITHOUT username and password:
				  	<ul>
				  		<li>Next 5 scheduled observations</li>
				  		<li>Previous past 5 observations and any data assotiated with them</li>
				  	</ul>
				  	If enabled, then login page will contain additional link to the presentation page.
				</small>
	        </div>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="submitting">Save</button>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'general',
  data () {
    return {
      entity: {},
      submitting: false
    }
  },
  mounted () {
    const vm = this
    vm.$http.get('/admin/config/general').then(function (response) {
      if (response.data) {
        response.data.retentionMaxSizeBytes = response.data.retentionMaxSizeBytes / 1024 / 1024 / 1024
      } 
      vm.entity = response.data
    })
  },
  methods: {
    detectLocation () {
      const vm = this
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          vm.entity.lat = position.coords.latitude
          vm.entity.lng = position.coords.longitude
          vm.entity.alt = position.coords.altitude
        })
      }
    },
    validateBeforeSubmit (e) {
      this.$validator.errors.clear()
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.submit()
        }
      })
    },
    submit: function (event) {
      if (this.submitting) {
        return
      }
      this.submitting = true
      const vm = this
      var toSubmit = Vue.util.extend({}, vm.entity)
      toSubmit.retentionMaxSizeBytes = toSubmit.retentionMaxSizeBytes * 1024 * 1024 * 1024
      if( toSubmit.alt === '') {
        delete toSubmit.alt
      }
      vm.$http.post('/admin/config/general', toSubmit).then(function (response) {
        vm.submitting = false
        vm.$router.push('/admin/restart')
      }).catch(function (error) {
        vm.submitting = false
        vm.handleError(vm, error)
      })
    }
  }
}
</script>
