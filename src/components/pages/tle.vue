<template>
  <div class="row">
    <div class="col-md-12">
      <p :class="color">Last update: {{ lastUpdatedFormatted }} UTC</p>
      <form class="form-inline" style="margin-top: 20px;">
          <div class="form-group">
            <label for="satellite">Satellite&nbsp;</label>
            <select class="form-control" v-model="selected" >
                <option :value="item.id" v-for="item in tle">{{ item.data[0] }}</option>
            </select>
          </div>          
      </form>
      <div v-for="item in tle" v-if="item.id === selected" style="margin-top: 20px;">
        <p>{{ item.data[1] }}</p>
        <p>{{ item.data[2] }}</p>
      </div>    
    </div>
  </div>
</template>

<script>

import moment from 'moment'

export default {
  name: 'tle',
  computed: {
    lastUpdatedFormatted: function () {
      return moment(this.lastUpdated).utc().format('DD-MM-YYYY')
    },
    color: function () {
      var current = new Date()
      if (current - this.lastUpdated <= 7 * 24 * 60 * 60 * 1000) {
        return 'text-success'
      } else if (current - this.lastUpdated <= 30 * 24 * 60 * 60 * 1000) {
        return 'text-warning'
      } else {
        return 'text-danger'
      }
    }
  },
  data () {
    return {
      selected: '',
      lastUpdated: '',
      tle: []
    }
  },
  mounted () {
    const vm = this
    vm.$http.get('/admin/tle').then(function (response) {
      vm.lastUpdated = response.data.lastUpdated
      vm.tle = response.data.tle
    }).catch(function (error) {
      vm.handleError(vm, error)
    })
  }
}
</script>
