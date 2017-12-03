<template>
	  <form class="form-signin" @submit.prevent="validateBeforeSubmit" style="top: 5%">
	  	<legend>Setup</legend>
        <b-alert variant="danger"
          dismissible
          :show="errors.has('general')">
        {{ errors.first('general') }}
        </b-alert>
        <p>This is a first time login. Please setup account:
          <ol>
            <li>Insert your SD card into the card reader</li>
            <li>Open SD card contents and create the file <mark>r2cloud.txt</mark> there</li>
            <li>Put some keyword into this file on a single line</li>
            <li>Save the file and open this page once again</li>
            <li>Enter the keyword, new email and password</li>
          </ol>          
        </p>
        <div class="form-group" :class="{'has-danger': errors.has('keyword') }">
          <input type="text" id="keyword" name="keyword" :class="{'is-invalid': errors.has('keyword') }" class="form-control" v-validate="'required'" placeholder="Keyword" autofocus="" v-model="keyword">
          <div class="invalid-feedback" v-if="errors.has('keyword')">{{ errors.first('keyword') }}</div>
        </div>
        <div class="form-group" :class="{'has-danger': errors.has('username') }">
          <input type="email" id="inputEmail" name="username" :class="{'is-invalid': errors.has('username') }" class="form-control" v-validate="'required|email'" placeholder="Email address" v-model="username">
          <div class="invalid-feedback" v-if="errors.has('username')">{{ errors.first('username') }}</div>
        </div>
        <div class="form-group" :class="{'has-danger': errors.has('password') }">
          <input type="password" id="inputPassword" name="password" :class="{'is-invalid': errors.has('password') }" class="form-control" v-validate="'required'" placeholder="Password" v-model="password">
          <div class="invalid-feedback" v-if="errors.has('password')">{{ errors.first('password') }}</div>
        </div>
        <button class="btn btn-lg btn-primary btn-block" :disabled="submitting" type="submit">Setup</button>
      </form>
</template>
<script>
  
  export default {
    data () {
      return {
        keyword: '',
        username: 'test@example.com',
        password: '1',
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
      submit: function (event) {
        if (this.submitting) {
          return
        }
        this.submitting = true
        const vm = this
        vm.$http.post('/setup/setup', {
          keyword: vm.keyword,
          username: vm.username,
          password: vm.password
        }).then(function (response) {
          vm.submitting = false
          vm.authenticate(vm, response.data.access_token)
        }).catch(function (error) {
          vm.submitting = false
          vm.handleError(vm, error)
        })
      }
    }
  }
</script>
