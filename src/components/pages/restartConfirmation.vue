<template>
    <div class="jumbotron col-md-12" v-if="!waitingForRestart">
      <h1>Please confirm restart</h1>
      <p class="lead">{{ confirmationMessage }}</p>
      <p><a class="btn btn-info" v-on:click.prevent="sendRestart" href="#">Restart</a></p>
    </div>
    <div class="col-md-12" style="text-align: center;" v-else>
      <i class="fa fa-cog fa-spin fa-3x fa-fw"></i><br/>
      <span class="">Restarting...</span>
    </div>
</template>
<script>
import Auth from '@/components/auth.js'

  export default {
    data() {
      return {
        timeoutFunction: '',
        waitingForRestart: false,
        confirmationMessage: 'To complete this operation a restart is required. Proceed?'
      }
    },
    unmounted() {
      if( this.timeoutFunction !== '' ) {
        clearTimeout(this.timeoutFunction)
      }
    },
    beforeRouteLeave (to, from, next) {
      clearTimeout(this.timeoutFunction)
      next()
    },
    mounted () {
      const vm = this
      if( vm.$route.query.confirmationMessage ) {
        vm.confirmationMessage = vm.$route.query.confirmationMessage
      }
    },
    methods: {
      checkHealth() {
        const vm = this
        vm.$http.get('/health').then(function (response) {
          Auth.logout()
          vm.$router.push('/login')
        }).catch(function () {
          vm.timeoutFunction = setTimeout(vm.checkHealth, 1000)
        })
      },
      sendRestart () {
        const vm = this
        vm.$globalData.waitingForRestart = true
        vm.waitingForRestart = true
        vm.$http.post('/admin/restart', {}).then(function (response) {
          vm.timeoutFunction = setTimeout(vm.checkHealth, 1000)
        }).catch(function () {
          vm.timeoutFunction = setTimeout(vm.checkHealth, 1000)
        })
      }
    }
  }
</script>