<template>
	  <form class="form-signin">
	  	<legend>Setup</legend>
	  	<b-alert variant="danger"
             dismissible
             :show="error !== ''">
          {{ error }}
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
        <div class="form-group">
          <input type="text" id="inputText" class="form-control" placeholder="Keyword" required="" autofocus="" v-model="keyword">
        </div>
        <div class="form-group">
          <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required="" autofocus="" v-model="username">
        </div>
        <div class="form-group">
          <input type="password" id="inputPassword" class="form-control" placeholder="Password" required="" v-model="password">
        </div>
        <button class="btn btn-lg btn-primary btn-block" v-on:click.prevent="submit">Setup</button>
      </form>
</template>
<script>
  
  export default {
    data () {
      return {
        keyword: '',
        username: 'test@example.com',
        password: '1',
        error: ''
      }
    },
    methods: {
      submit () {
        // redirect on success
      }
    }
  }
</script>
