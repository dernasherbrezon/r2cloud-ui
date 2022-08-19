<template>
  <div class="row">
    <div class="col-md-12">
      <h1 class="pb-2 mb-2 border-bottom">Integrations</h1>
      <b-alert variant="danger"
        dismissible
        :show="errors.has('general')">
      {{ errors.first('general') }}
      </b-alert>
    </div>
    <div class="col-md-12">
      <form @submit.prevent="validateBeforeSubmit">
        <h3 class="pb-2 mb-2 border-bottom">Leosatdata</h3>
        <div class="form-group" :class="{'has-danger': errors.has('apiKey') }">
          <label for="apiKey">API key</label>
          <input type="text" id="apiKey" name="apiKey" class="form-control" :class="{'is-invalid': errors.has('apiKey') }" v-validate="'required'" v-model="apiKey">
          <div class="invalid-feedback" v-if="errors.has('apiKey')">{{ errors.first('apiKey') }}</div>
          <small id="apiKeyHelp" class="form-text text-muted">You can register at <a href="https://leosatdata.com/register/load">leosatdata.com</a> and obtain an API key there.</small>
        </div>
        <div class="form-group">
	        <div class="form-check">
	            <input class="form-check-input" type="checkbox" id="gridCheck" v-model="syncSpectogram">
	            <label class="form-check-label" for="gridCheck"> Upload spectogram</label>
	        </div>
        </div>
        <div class="form-group">
	        <div class="form-check">
	            <input class="form-check-input" type="checkbox" id="newLaunch" v-model="newLaunch">
	            <label class="form-check-label" for="newLaunch"> New launches</label>
	            <small id="newLaunchHelp" class="form-text text-muted">Schedule observations for new launches with top priority. More info in the <a href="https://github.com/dernasherbrezon/r2cloud/wiki/Tracking-newly-launched-satellites">documentation</a>.</small>
	        </div>
        </div>
        <h3 class="pb-2 mb-2 border-bottom">SatNOGS</h3>
        <div class="form-group">
	        <div class="form-check">
	            <input class="form-check-input" type="checkbox" id="satnogs" v-model="satnogs">
	            <label class="form-check-label" for="satnogs"> Load satellites</label>
	            <small id="satnogsHelp" class="form-text text-muted">Load new launches and active satellites using <a href="https://db.satnogs.org/api/">SatNOGS API</a></small>
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
  name: 'r2cloud',
  data () {
    return {
      apiKey: '',
      syncSpectogram: false,
      newLaunch: false,
      satnogs: false,
      submitting: false,
      success: false
    }
  },
  mounted () {
    const vm = this
    vm.$http.get('/admin/config/r2cloud').then(function (response) {
      vm.apiKey = response.data.apiKey
      vm.syncSpectogram = response.data.syncSpectogram
      vm.newLaunch = response.data.newLaunch
      vm.satnogs = response.data.satnogs
    })
  },
  methods: {
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
      vm.$http.post('/admin/config/r2cloud', {
        apiKey: vm.apiKey,
        syncSpectogram: vm.syncSpectogram,
        newLaunch: vm.newLaunch,
        satnogs: vm.satnogs
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
