<template>
  <div class="row">
    <div class="col-md-12">
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
                <button id="detect" type="button" class="btn btn-default" v-on:click="detectLocation" style="display: block;">Detect</button>
            </div>
          </div>
        </div>
        <div class="checkbox">
          <label>
            <input type="checkbox" v-model="autoUpdate"> Auto-update enabled
          </label>
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
      autoUpdate: false,
      submitting: false,
      success: false
    }
  },
  mounted () {
    const vm = this
    vm.$http.get('/admin/config/general').then(function (response) {
      vm.lat = response.data.lat
      vm.lng = response.data.lng
      vm.autoUpdate = response.data.autoUpdate
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
        autoUpdate: vm.autoUpdate
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
