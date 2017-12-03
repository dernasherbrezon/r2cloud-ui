<template>
      <form class="form-signin" @submit.prevent="validateBeforeSubmit">
        <legend>Restore</legend>
        <b-alert variant="danger"
          dismissible
          :show="errors.has('general')">
        {{ errors.first('general') }}
        </b-alert>
        <p>Please enter email address specified during initial setup.</p>
        <div class="form-group" :class="{'has-danger': errors.has('username') }">
          <input type="email" id="inputEmail" name="username" :class="{'is-invalid': errors.has('username') }" class="form-control" v-validate="'required|email'" placeholder="Email address" autofocus="" v-model="username">
          <div class="invalid-feedback" v-if="errors.has('username')">{{ errors.first('username') }}</div>
        </div>
        <button class="btn btn-lg btn-primary btn-block" :disabled="submitting" type="submit">Restore</button>
      </form>
</template>
<script>
  export default {
    data () {
      return {
        username: '',
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
      submit () {
        if (this.submitting) {
          return
        }
        this.submitting = true
        const vm = this
        vm.$http.post('/setup/restore', {
          username: vm.username
        }).then(function (response) {
          vm.submitting = false
          localStorage.setItem('configured', false)
          vm.$router.push('/setup')
        }).catch(function (error) {
          vm.submitting = false
          vm.handleError(vm, error)
        })
      }
    }
  }
</script>
