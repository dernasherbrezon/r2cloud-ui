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
          <input type="text" id="apiKey" name="apiKey" class="form-control" :class="{'is-invalid': errors.has('apiKey') }" v-model="entity.apiKey">
          <div class="invalid-feedback" v-if="errors.has('apiKey')">{{ errors.first('apiKey') }}</div>
          <small id="apiKeyHelp" class="form-text text-muted">You can register at <a href="https://leosatdata.com/register/load">leosatdata.com</a> and obtain an API key there.</small>
        </div>
        <div class="form-group">
	        <div class="form-check">
	            <input class="form-check-input" type="checkbox" id="gridCheck" v-model="entity.syncSpectogram">
	            <label class="form-check-label" for="gridCheck"> Upload spectogram</label>
	        </div>
        </div>
        <div class="form-group">
	        <div class="form-check">
	            <input class="form-check-input" type="checkbox" id="newLaunch" v-model="entity.newLaunch">
	            <label class="form-check-label" for="newLaunch"> New launches</label>
	            <small id="newLaunchHelp" class="form-text text-muted">Schedule observations for new launches with top priority. More info in the <a href="https://github.com/dernasherbrezon/r2cloud/wiki/Tracking-newly-launched-satellites">documentation</a>.</small>
	        </div>
        </div>
        <h3 class="pb-2 mb-2 border-bottom">SatNOGS</h3>
        <div class="form-group">
	        <div class="form-check">
	            <input class="form-check-input" type="checkbox" id="satnogs" v-model="entity.satnogs">
	            <label class="form-check-label" for="satnogs"> Load satellites</label>
	            <small id="satnogsHelp" class="form-text text-muted">Load new launches and active satellites using <a href="https://db.satnogs.org/api/">SatNOGS API</a></small>
	        </div>
        </div>
        <h3 class="pb-2 mb-2 border-bottom">InfluxDB</h3>
        <div class="row">
	        <div class="col-md-4">
	            <div class="form-group" :class="{'has-danger': errors.has('influxdbHostname') }">
	              <label for="influxdbHostname">Hostname</label>
	              <input type="text" id="influxdbHostname" name="influxdbHostname" :class="{'is-invalid': errors.has('influxdbHostname') }" class="form-control" v-model="entity.influxdbHostname">
	              <div class="invalid-feedback" v-if="errors.has('influxdbHostname')">{{ errors.first('influxdbHostname') }}</div>
	              <small id="influxdbHostnameHelp" class="form-text text-muted">Example: 127.0.0.1</small>
	            </div>
	        </div>
	        <div class="col-md-4">
	            <div class="form-group" :class="{'has-danger': errors.has('influxdbPort') }">
	              <label for="influxdbPort">Port</label>
	              <input type="number" id="influxdbPort" name="influxdbPort" :class="{'is-invalid': errors.has('influxdbPort') }" v-validate="'integer'" class="form-control" v-model.number="entity.influxdbPort">
	              <div class="invalid-feedback" v-if="errors.has('influxdbPort')">{{ errors.first('influxdbPort') }}</div>
	              <small id="influxdbPortHelp" class="form-text text-muted">Example: 8086</small>
	            </div>
	        </div>
	        <div class="col-md-4">
	            <div class="form-group" :class="{'has-danger': errors.has('influxdbDatabase') }">
	              <label for="influxdbDatabase">Database</label>
	              <input type="text" id="influxdbDatabase" name="influxdbDatabase" :class="{'is-invalid': errors.has('influxdbDatabase') }" class="form-control" v-model="entity.influxdbDatabase">
	              <div class="invalid-feedback" v-if="errors.has('influxdbDatabase')">{{ errors.first('influxdbDatabase') }}</div>
	              <small id="influxdbDatabaseHelp" class="form-text text-muted">Database should exist. Create new using the command: create database r2cloud</small>
	            </div>
	        </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group" :class="{'has-danger': errors.has('influxdbUsername') }">
                  <label for="influxdbUsername">Username</label>
                  <input type="text" id="influxdbUsername" name="influxdbUsername" :class="{'is-invalid': errors.has('influxdbUsername') }" class="form-control" v-model="entity.influxdbUsername">
                  <div class="invalid-feedback" v-if="errors.has('influxdbUsername')">{{ errors.first('influxdbUsername') }}</div>
                  <small id="influxdbUsernameHelp" class="form-text text-muted">Credentials to connect</small>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group" :class="{'has-danger': errors.has('influxdbPassword') }">
                  <label for="influxdbPassword">Password</label>
                  <input type="password" id="influxdbPassword" name="influxdbPassword" :class="{'is-invalid': errors.has('influxdbPassword') }" class="form-control" v-model="entity.influxdbPassword">
                  <div class="invalid-feedback" v-if="errors.has('influxdbPassword')">{{ errors.first('influxdbPassword') }}</div>
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
  name: 'r2cloud',
  data () {
    return {
      submitting: false,
      success: false,
      entity: {}
    }
  },
  mounted () {
    const vm = this
    vm.$http.get('/admin/config/r2cloud').then(function (response) {
      vm.entity = response.data
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
      vm.$http.post('/admin/config/r2cloud', vm.entity).then(function (response) {
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
