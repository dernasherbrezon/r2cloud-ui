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
              <input type="text" id="lat" name="lat" :class="{'is-invalid': errors.has('lat') }" v-validate="'required|decimal'" class="form-control" v-model="lat">
              <div class="invalid-feedback" v-if="errors.has('lat')">{{ errors.first('lat') }}</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group" :class="{'has-danger': errors.has('lng') }">
              <label for="lng">Longitude</label>
              <input type="text" id="lng" name="lng" :class="{'is-invalid': errors.has('lng') }" v-validate="'required|decimal'" class="form-control" v-model="lng">
              <div class="invalid-feedback" v-if="errors.has('lng')">{{ errors.first('lng') }}</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
                <label for="detect">&nbsp;</label>
                <button id="detect" type="button" class="btn btn-light" v-on:click="detectLocation" style="display: block;">Detect</button>
            </div>
          </div>
        </div>
        <div class="row">
        	<div class="col-md-4">
				<div class="form-group">
		          <label for="ppmType">PPM type</label>
		          <select class="form-control" id="ppmType" v-model="ppmType">
		            <option value="AUTO">AUTO</option>
		            <option value="MANUAL">MANUAL</option>
		          </select>
		        </div>
        	</div>
        	<div class="col-md-4">
				<div class="form-group">
		          <label for="ppm">PPM</label>
	              <input type="text" id="ppm" name="ppm" :class="{'is-invalid': errors.has('ppm') }" :readonly="ppmType === 'AUTO'" class="form-control" v-model="ppm">
	              <div class="invalid-feedback" v-if="errors.has('ppm')">{{ errors.first('ppm') }}</div>
		        </div>
        	</div>
        </div>
        <div class="form-group">
	        <div class="form-check">
	            <input class="form-check-input" type="checkbox" id="gridCheck" v-model="autoUpdate">
	            <label class="form-check-label" for="gridCheck"> Auto-update enabled</label>
	        </div>
        </div>
        <hr/>
        <div class="form-group">
	        <div class="form-check">
	            <input class="form-check-input" type="checkbox" id="presentationMode" v-model="presentationMode">
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
        <hr/>
        <div class="row">
        	<div class="col-md-4">
				<div class="form-group" :class="{'has-danger': errors.has('elevationMin') }">
		          <label for="elevationMin">Minimum elevation</label>
	              <input type="text" id="elevationMin" name="elevationMin" :class="{'is-invalid': errors.has('elevationMin') }" v-validate="'required|decimal'" class="form-control" v-model="elevationMin">
	              <div class="invalid-feedback" v-if="errors.has('elevationMin')">{{ errors.first('elevationMin') }}</div>
		        </div>
        	</div>
        	<div class="col-md-4">
				<div class="form-group" :class="{'has-danger': errors.has('elevationGuaranteed') }">
		          <label for="elevationGuaranteed">Guaranteed elevation</label>
	              <input type="text" id="elevationGuaranteed" name="elevationGuaranteed" :class="{'is-invalid': errors.has('elevationGuaranteed') }" v-validate="'required|decimal'" class="form-control" v-model="elevationGuaranteed">
	              <div class="invalid-feedback" v-if="errors.has('elevationGuaranteed')">{{ errors.first('elevationGuaranteed') }}</div>
		        </div>
        	</div>
        </div>
        <hr/>
        <div class="row">
        	<div class="col-md-4">
				<div class="form-group" :class="{'has-danger': errors.has('gain') }">
		          <label for="gain">RTL-SDR gain</label>
	              <input type="text" id="gain" name="gain" :class="{'is-invalid': errors.has('gain') }" v-validate="'required|decimal'" class="form-control" v-model="gain">
	              <div class="invalid-feedback" v-if="errors.has('gain')">{{ errors.first('gain') }}</div>
		        </div>
        	</div>
        	<div class="col-md-4">
		        <div class="form-group">
		        	<label for="gain">Bias-t enabled</label><br/>
		            <input class="form-control" type="checkbox" id="biast" v-model="biast">
					<small id="biast" class="form-text text-muted">
						Will enable <a href="https://en.wikipedia.org/wiki/Bias_tee">bias-t</a> before every observation and disable afterwards
					</small>
		        </div>
        	</div>
        </div>        
        <hr/>
        <div class="row">
        	<div class="col-md-12">
	        	<h3>Rotator configuration</h3>
	        	<p>Before configuring rotator make sure rotctrld daemon is running.</p>
        	</div>
        </div>
        <div class="form-group">
	        <div class="form-check">
	            <input class="form-check-input" type="checkbox" id="rotationEnabled" v-model="rotationEnabled">
	            <label class="form-check-label" for="rotationEnabled"> Rotator enabled</label>
	        </div>
        </div>
        <div class="row">
        	<div class="col-md-4">
	            <div class="form-group" :class="{'has-danger': errors.has('rotctrldHostname') }">
	              <label for="rotctrldHostname">Hostname</label>
	              <input type="text" id="rotctrldHostname" name="rotctrldHostname" :class="{'is-invalid': errors.has('rotctrldHostname') }" class="form-control" v-model="rotctrldHostname">
	              <div class="invalid-feedback" v-if="errors.has('rotctrldHostname')">{{ errors.first('rotctrldHostname') }}</div>
	            </div>
        	</div>
        	<div class="col-md-4">
	            <div class="form-group" :class="{'has-danger': errors.has('rotctrldPort') }">
	              <label for="rotctrldPort">Port</label>
	              <input type="text" id="rotctrldPort" name="rotctrldPort" :class="{'is-invalid': errors.has('rotctrldPort') }" class="form-control" v-model="rotctrldPort">
	              <div class="invalid-feedback" v-if="errors.has('rotctrldPort')">{{ errors.first('rotctrldPort') }}</div>
	            </div>
        	</div>
        </div>
        <div class="row">
        	<div class="col-md-4">
	            <div class="form-group" :class="{'has-danger': errors.has('rotatorTolerance') }">
	              <label for="rotatorTolerance">Tolerance (degrees)</label>
	              <input type="text" id="rotatorTolerance" name="rotatorTolerance" :class="{'is-invalid': errors.has('rotatorTolerance') }" v-validate="'decimal'" class="form-control" v-model="rotatorTolerance">
	              <div class="invalid-feedback" v-if="errors.has('rotatorTolerance')">{{ errors.first('rotatorTolerance') }}</div>
	            </div>
        	</div>
        	<div class="col-md-4">
	            <div class="form-group" :class="{'has-danger': errors.has('rotatorCycle') }">
	              <label for="rotatorCycle">Cycle (millis)</label>
	              <input type="text" id="rotatorCycle" name="rotatorCycle" :class="{'is-invalid': errors.has('rotatorCycle') }" class="form-control" v-model="rotatorCycle">
	              <div class="invalid-feedback" v-if="errors.has('rotatorCycle')">{{ errors.first('rotatorCycle') }}</div>
	            </div>
        	</div>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="submitting">Save</button>
        <span v-if="success" class="text-success" style="margin-left: 20px;">Saved</span>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'general',
  data () {
    return {
      lat: '',
      lng: '',
      elevationMin: '',
      elevationGuaranteed: '',
      autoUpdate: false,
      submitting: false,
      ppmType: 'AUTO',
      ppm: 0,
      rotationEnabled: false,
      rotctrldPort: 4533,
      rotctrldHostname: '127.0.0.1',
      rotatorTolerance: 5,
      rotatorCycle: 1000,
      success: false,
      gain: 45,
      biast: false,
      presentationMode: false
    }
  },
  mounted () {
    const vm = this
    vm.$http.get('/admin/config/general').then(function (response) {
      vm.lat = response.data.lat
      vm.lng = response.data.lng
      vm.autoUpdate = response.data.autoUpdate
      vm.ppmType = response.data.ppmType
      vm.ppm = response.data.ppm
      vm.elevationMin = response.data.elevationMin
      vm.elevationGuaranteed = response.data.elevationGuaranteed
      vm.rotationEnabled = response.data.rotationEnabled
      vm.rotctrldPort = response.data.rotctrldPort
      vm.rotctrldHostname = response.data.rotctrldHostname
      vm.rotatorTolerance = response.data.rotatorTolerance
      vm.rotatorCycle = response.data.rotatorCycle
      vm.gain = response.data.gain
      vm.biast = response.data.biast
      vm.presentationMode = response.data.presentationMode
    })
  },
  methods: {
    detectLocation () {
      const vm = this
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          vm.lat = position.coords.latitude
          vm.lng = position.coords.longitude
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
      this.success = false
      this.submitting = true
      const vm = this
      vm.$http.post('/admin/config/general', {
        lat: parseFloat(vm.lat),
        lng: parseFloat(vm.lng),
        autoUpdate: vm.autoUpdate,
        ppmType: vm.ppmType,
        ppm: vm.ppm,
        elevationMin: parseFloat(vm.elevationMin),
        elevationGuaranteed: parseFloat(vm.elevationGuaranteed),
        rotationEnabled: vm.rotationEnabled,
        rotctrldPort: parseInt(vm.rotctrldPort),
        rotctrldHostname: vm.rotctrldHostname,
        rotatorTolerance: parseFloat(vm.rotatorTolerance),
        rotatorCycle: parseInt(vm.rotatorCycle),
        gain: parseFloat(vm.gain),
        biast: vm.biast,
        presentationMode: vm.presentationMode
      }).then(function (response) {
        vm.submitting = false
        vm.success = true
      }).catch(function (error) {
        vm.submitting = false
        vm.handleError(vm, error)
      })
    }
  }
}
</script>
