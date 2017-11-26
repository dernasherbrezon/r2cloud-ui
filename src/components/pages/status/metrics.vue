<template>
  <div class="row">
    <div class="col-md-12">
      <form class="form-inline" style="margin-top: 20px;">
	    <div class="form-group">
	      <label for="period">Period&nbsp;</label>
	      <select id="updateInterval" class="form-control" v-model="interval" v-on:click="changeInterval">
	        <option selected value="DAY">Last day</option>
	        <option value="MONTH">Last month</option>
	        <option value="YEAR">Last year</option>
	      </select>
	    </div>          
      </form>
    </div>
	  <div class="col-md-12">
	  	<timeSeries v-for="item in graphs" :chartData="item.chartData" :key="item.id" :id="item.id" :height="100" />
	  </div>
  </div>
</template>

<script>

import timeSeries from '@/components/graph/TimeSeries'
import RRDFile from 'rrd4j-js'
import axios from 'axios'

export default {
  name: 'metrics',
  components: {timeSeries},
  data () {
    return {
      graphs: [],
      interval: 'DAY'
    }
  },
  methods: {
    changeInterval: function (event) {
      this.reload()
    },
    reload: function () {
      const vm = this
      axios.get('/static/demo.rrd', {
        responseType: 'arraybuffer'
      }).then(function (response) {
        var file = new RRDFile(new Uint8Array(response.data))
        var rrddata = file.getData('sun', 'AVERAGE', new Date(1272668400000), new Date(1277938800000))
        var converted = []
        for (var i = 0; i < rrddata.data.length; i++) {
          converted.push({
            x: rrddata.data[i][0],
            y: rrddata.data[i][1]
          })
        }
        vm.graphs = [{
          id: '1',
          type: 'bytes',
          chartData: {
            datasets: [{
              backgroundColor: 'rgba(128, 182, 244, 0.3)',
              label: 'Data name ' + vm.interval,
              data: converted
            }]
          }
        }]
      })
    }
  },
  mounted () {
    this.reload()
  }
}
</script>
