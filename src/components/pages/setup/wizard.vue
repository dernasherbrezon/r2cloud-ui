<template>
	  <form class="form-signin" @submit.prevent="submit" style="top: 5%">
	    <div v-if="step1">
  	  	  <legend>Setup coordinates</legend>
          <p>Base station coordinates are essential for scheduling satellite observations</p>
          <div class="form-group" :class="{'has-danger': errors.has('lat') }">
            <input type="text" id="lat" name="lat" :class="{'is-invalid': errors.has('lat') }" v-validate="'required|decimal'" class="form-control" v-model="lat">
            <div class="invalid-feedback" v-if="errors.has('lat')">{{ errors.first('lat') }}</div>
          </div>
          <div class="form-group" :class="{'has-danger': errors.has('lng') }">
            <input type="text" id="lng" name="lng" :class="{'is-invalid': errors.has('lng') }" v-validate="'required|decimal'" class="form-control" v-model="lng">
            <div class="invalid-feedback" v-if="errors.has('lng')">{{ errors.first('lng') }}</div>
          </div>
          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">Automatically detect using current browser.</label>
              </div>
              <button id="inputGroupSelect01" type="button" class="btn btn-default" v-on:click="detectLocation" style="display: block;">Detect</button>
            </div>
          </div>
          <button class="btn btn-lg btn-primary btn-block" type="button" v-on:click="validateStep1">Next</button>
        </div>
        <div v-if="step2">
          <legend>Automatic updates</legend>
          <p>Automatic updates will keep your base station up-to-date. We constantly deliver new functionality and bug fixes</p>
          <div class="checkbox">
            <label>
              <input type="checkbox" v-model="autoUpdate" checked=""> Enable
            </label>
          </div>
          <div class="row">
          <div class="col-md-2">
            <a href="#" class="btn btn-lg" v-on:click="step1 = true, step2 = false">Back</a>
          </div>
          <div class="col-md-9 offset-md-1">
            <button class="btn btn-lg btn-primary btn-block" :disabled="submitting" type="submit">Finish</button>
          </div>
          </div>
        </div>
      </form>
</template>
<script>
  import auth from '@/components/auth.js'

  export default {
    data () {
      return {
        lat: '',
        lng: '',
        autoUpdate: false,
        step1: true,
        step2: false,
        submitting: false
      }
    },
    methods: {
      validateStep1 (e) {
        const vm = this
        this.$validator.errors.clear()
        this.$validator.validateAll().then((result) => {
          if (result) {
            vm.step1 = false
            vm.step2 = true
          }
        })
      },
      detectLocation () {
        const vm = this
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            vm.lat = position.coords.latitude
            vm.lng = position.coords.longitude
          })
        }
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
          ppmType: 'AUTO'
        }).then(function (response) {
          vm.submitting = false
          auth.setGeneralSetup(true)
          vm.navigateAfterAuthentication(vm)
        }).catch(function (error) {
          vm.submitting = false
          vm.handleError(vm, error)
        })
      }
    }
  }
</script>
