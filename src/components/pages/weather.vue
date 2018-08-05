<template>
  <div class="row">
    <div class="col-md-12" v-if="enabled">
      <satellites url="/admin/weather"/>
    </div>
    <div class="col-md-12" v-else-if="!enabled">
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
import satellites from '@/components/pages/satellites.vue'

export default {
  name: 'weather',
  components: {satellites},
  data () {
    return {
      enabled: true,
      agreeWithToC: false,
      submitting: false
    }
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
    }
  }
}
</script>
