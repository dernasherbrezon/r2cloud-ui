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
        <div class="form-group" :class="{'has-danger': errors.has('apiKey') }">
          <label for="apiKey">API key</label>
          <input type="text" id="apiKey" name="apiKey" class="form-control" :class="{'is-invalid': errors.has('apiKey') }" v-validate="required" v-model="apiKey">
          <div class="invalid-feedback" v-if="errors.has('apiKey')">{{ errors.first('apiKey') }}</div>
        </div>
        <div class="checkbox">
          <label>
            <input type="checkbox" v-model="syncSpectogram"> Upload spectogram
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
  name: 'r2cloud',
  data () {
    return {
      apiKey: '',
      syncSpectogram: false,
      submitting: false,
      success: false
    }
  },
  mounted () {
    const vm = this
    vm.$http.get('/admin/config/r2cloud').then(function (response) {
      vm.apiKey = response.data.apiKey
      vm.syncSpectogram = response.data.syncSpectogram
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
        syncSpectogram: vm.syncSpectogram
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
