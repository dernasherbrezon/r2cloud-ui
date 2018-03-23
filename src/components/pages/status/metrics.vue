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
	  	<timeSeries v-for="item in graphs" :chart-id="item.id" :format="item.format" :scale="formattedInterval" :chartData="item.chartData" :key="item.id" :id="item.id" :height="100" />
	  </div>
  </div>
</template>

<script>
import timeSeries from '@/components/TimeSeries.js'
import RRDFile from 'rrd4j-js'

export default {
  name: 'metrics',
  components: {timeSeries},
  data () {
    return {
      graphs: [],
      interval: 'DAY'
    }
  },
  computed: {
    formattedInterval: function () {
      if (this.interval === 'DAY') {
        return 'hour'
      } else if (this.interval === 'MONTH') {
        return 'day'
      } else if (this.interval === 'YEAR') {
        return 'month'
      }
    }
  },
  methods: {
    changeInterval: function (event) {
      this.graphs = []
      this.reload()
    },
    reload: function () {
      const vm = this
      vm.$http.get('/admin/status/metrics').then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
          (function (currentMetric) {
            vm.$http.get(currentMetric.url, {
              responseType: 'arraybuffer'
            }).then(function (response) {
              var file = new RRDFile(new Uint8Array(response.data))
              var start = new Date()
              var end = new Date()
              if (vm.interval === 'DAY') {
                start.setDate(end.getDate() - 1)
              } else if (vm.interval === 'MONTH') {
                start.setMonth(start.getMonth() - 1)
              } else if (vm.interval === 'YEAR') {
                start.setFullYear(start.getFullYear() - 1)
              }
              var rrddata = file.getData('data', 'AVERAGE', start, end)
              var converted = []
              for (var i = 0; i < rrddata.data.length; i++) {
                converted.push({
                  x: rrddata.data[i][0],
                  y: rrddata.data[i][1]
                })
              }
              vm.graphs.push({
                id: currentMetric.id,
                format: currentMetric.format,
                chartData: {
                  datasets: [{
                    backgroundColor: 'rgba(128, 182, 244, 0.3)',
                    label: currentMetric.id,
                    data: converted
                  }]
                }
              })
              vm.graphs.sort(function (a, b) {
                if (a.id < b.id) {
                  return -1
                }
                if (a.id > b.id) {
                  return 1
                }
                return 0
              })
            })
          })(response.data[i])
        }
      }).catch(function (error) {
        vm.handleError(vm, error)
      })
    }
  },
  mounted () {
    this.reload()
  }
}
</script>
