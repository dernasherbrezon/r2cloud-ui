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
          <div class="col-md-6">
            <div class="form-group" :class="{'has-danger': errors.has('domain') }">
              <label for="domain">Domain</label>
              <input type="text" id="domain" name="domain" class="form-control" :class="{'is-invalid': errors.has('domain') }" v-validate="'required|url'" v-model="ssl.domain">
              <div class="invalid-feedback" v-if="errors.has('domain')">{{ errors.first('domain') }}</div>
            </div>
            <div class="form-check">
              <label class="form-check-label">
                <input type="checkbox" class="form-check-input" v-model="ssl.enabled"> SSL enabled
              </label>
            </div>
            <div class="form-check" :class="{'has-danger': errors.has('agreeWithToC') }">
              <label class="form-check-label" :class="{'is-invalid': errors.has('agreeWithToC') }">
                <input type="checkbox" name="agreeWithToC" class="form-check-input" v-model="ssl.agreeWithToC" v-validate="requiredToC"> Agree with <a href="https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf" target="blank">Terms and Conditions</a>
              </label>
              <div class="invalid-feedback" v-if="errors.has('agreeWithToC')">{{ errors.first('agreeWithToC') }}</div>
            </div>
            <button type="submit" :disabled="running" class="btn btn-primary">Save</button>
          </div>
          <div v-show="log.length > 0" class="col-md-6">
              <div class="form-group">
                  <ul class="fa-ul" id="sslMessages">
                      <li><i class="fa-li fa"></i><b>Log</b></li>
                      <li v-for="(item, index) in log"><i v-if="running && index === (log.length - 1)" class="fa-li fa fa-circle-o-notch fa-spin"></i>{{ escapeHtml(item.message) }}</li>
                  </ul>
              </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ssl',
  data () {
    return {
      ssl: {
        domain: '',
        enabled: false,
        agreeWithToC: false
      },
      running: false,
      log: []
    }
  },
  computed: {
    requiredToC () {
      if (this.ssl.enabled === true) {
        return 'required'
      }
      return ''
    }
  },
  mounted () {
    const vm = this
    vm.$http.get('/admin/config/ssl').then(function (response) {
      vm.ssl.domain = response.data.domain
      vm.ssl.enabled = response.data.enabled
      vm.ssl.agreeWithToC = response.data.agreeWithToC
      vm.running = response.data.running
      vm.log = response.data.log
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
    submit (event) {
      if (this.running) {
        return
      }
      this.running = true
      this.log = []
      const vm = this
      vm.$http.post('/admin/config/ssl', {
        domain: vm.ssl.domain,
        enabled: vm.ssl.enabled,
        agreeWithToC: vm.ssl.agreeWithToC
      }).then(function (response) {
        vm.appendMessage()
      }).catch(function (error) {
        vm.running = false
        vm.handleError(vm, error)
      })
    },
    appendMessage () {
      const vm = this
      vm.$http.get('/admin/config/ssl/log?index=' + vm.log.length).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          var curMessage = {
            message: response.data[i]
          }
          vm.log.push(curMessage)
        }
        if (response.status === 206) {
          setTimeout(vm.appendMessage, 2000)
        } else {
          vm.running = false
        }
      }).catch(function (error) {
        vm.running = false
        vm.handleError(vm, error)
      })
    },
    escapeHtml (unsafe) {
      return unsafe
     .replace(/&/g, '&amp;')
     .replace(/</g, '&lt;')
     .replace(/>/g, '&gt;')
     .replace(/"/g, '&quot;')
     .replace(/'/g, '&#039;')
    }
  }
}
</script>

<style>
.form-check-label.is-invalid {
  color: #dc3545;
}
.form-check-label.is-invalid ~ .invalid-feedback {
  display: block;
}
</style>
