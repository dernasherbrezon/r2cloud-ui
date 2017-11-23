<template>
  <div class="row">
    <div class="col-md-12">
      <p :class="color">Last update: {{ lastUpdatedFormatted }} UTC</p>
      <form class="form-inline" style="margin-top: 20px;">
          <div class="form-group">
            <label for="satellite">Satellite</label>
            <select class="form-control" v-model="selected" >
                <option value=""></option>
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
  name: 'ddns',
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
      lastUpdated: 1272668400000,
      tle: [{
        id: '1',
        data: ['NOAA 18', 'test line1', 'test line2']
      }, {
        id: '2',
        data: ['NOAA 19', '1 28654U 05018A 17322.49258488 .00000039 00000-0 46486-4 0 9996', '2 28654 99.1705 348.3919 0014261 2.8630 357.2620 14.12357364644047']
      }, {
        id: '3',
        data: ['NOAA 15', 'test line1', 'test line2']
      }
      ]
    }
  },
  methods: {
    save: function (event) {
    }
  }
}
</script>
