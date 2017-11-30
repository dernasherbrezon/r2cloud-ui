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
        <div class="form-group">
          <label for="ddnsType">Type</label>
          <select class="form-control" id="ddnsType" v-model="type">
            <option value="NONE">NONE</option>
            <option value="NOIP">NOIP</option>
          </select>
        </div>
        <div v-if="type === 'NONE'">
        </div>
        <div v-if="type === 'NOIP'">
          <div class="form-group" :class="{'has-danger': errors.has('username') }">
            <label for="username">User name</label>
            <input type="text" id="username" name="username" class="form-control" v-validate="requiredForNOIP" v-model="username">
            <div class="invalid-feedback" v-if="errors.has('username')">{{ errors.first('username') }}</div>
          </div>
          <div class="form-group" :class="{'has-danger': errors.has('password') }">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" class="form-control" v-validate="requiredForNOIP" v-model="password">
            <div class="invalid-feedback" v-if="errors.has('password')">{{ errors.first('password') }}</div>
          </div>
          <div class="form-group" :class="{'has-danger': errors.has('domain') }">
            <label for="domain">Domain</label>
            <input type="text" id="domain" name="domain" class="form-control" v-validate="requiredForNOIP" v-model="domain">
            <div class="invalid-feedback" v-if="errors.has('domain')">{{ errors.first('domain') }}</div>
          </div>
          <div class="form-group">
            <label for="currentIp">Current IP</label>
            <input type="text" id="currentIp" class="form-control" disabled v-model="currentIp">
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
  name: 'ddns',
  data () {
    return {
      type: 'NONE',
      username: '',
      password: '',
      domain: '',
      currentIp: '',
      submitting: false,
      success: false
    }
  },
  computed: {
    requiredForNOIP () {
      if (this.type === 'NOIP') {
        return 'required'
      }
      return ''
    }
  },
  mounted () {
    const vm = this
    vm.$http.get('/admin/config/ddns').then(function (response) {
      vm.type = response.data.type
      vm.username = response.data.username
      vm.password = response.data.password
      vm.domain = response.data.domain
      vm.currentIp = response.data.currentIp
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
      vm.$http.post('/admin/config/ddns', {
        type: vm.type,
        username: vm.username,
        password: vm.password,
        domain: vm.domain
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
