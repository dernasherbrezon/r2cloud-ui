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
        <button type="submit" class="btn btn-primary" :disabled="submitting">Save</button>
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
      autoUpdate: false,
      presentationMode: false,
      submitting: false
    }
  },
  mounted () {
    const vm = this
    vm.$http.get('/admin/config/general').then(function (response) {
      vm.lat = response.data.lat
      vm.lng = response.data.lng
      vm.autoUpdate = response.data.autoUpdate
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
      this.submitting = true
      const vm = this
      vm.$http.post('/admin/config/general', {
        lat: parseFloat(vm.lat),
        lng: parseFloat(vm.lng),
        autoUpdate: vm.autoUpdate,
        presentationMode: vm.presentationMode
      }).then(function (response) {
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
