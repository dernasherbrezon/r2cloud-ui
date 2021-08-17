<template>
  <div class="row">
    <div class="col-md-12">
      <h1 class="pb-2 mb-2 border-bottom">R2Server configuration</h1>
      <p>You can register at <a href="https://r2server.ru">https://r2server.ru</a> and obtain an API key there.</p>
      <b-alert variant="danger"
        dismissible
        :show="errors.has('general')">
      {{ errors.first('general') }}
      </b-alert>
    </div>  
    <div class="col-md-12">
      <form @submit.prevent="validateBeforeSubmit">
        <div class="form-group" :class="{'has-danger': errors.has('apiKey') }">
          <label for="apiKey">API key</label>
          <input type="text" id="apiKey" name="apiKey" class="form-control" :class="{'is-invalid': errors.has('apiKey') }" v-validate="'required'" v-model="apiKey">
          <div class="invalid-feedback" v-if="errors.has('apiKey')">{{ errors.first('apiKey') }}</div>
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
        newLaunch: vm.newLaunch
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
