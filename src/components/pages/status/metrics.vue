<template>
  <div class="row">
    <div class="col-md-12">
      <form class="form-inline" style="margin-top: 20px;">
	    <div class="form-group">
	      <label for="period">Period</label>
	      <select id="updateInterval" class="form-control" >
	        <option selected value="DAY">Last day</option>
	        <option value="MONTH">Last month</option>
	        <option value="YEAR">Last year</option>
	      </select>
	    </div>          
      </form>
    </div>
	  <div class="col-md-12">
	  	<timeSeries v-for="item in graphs" :data="item.data" :key="item.id" :id="item.id" :height="100" />
	  </div>
  </div>
</template>

<script>

import timeSeries from '@/components/graph/TimeSeries'

export default {
  name: 'metrics',
  components: {timeSeries},
  data () {
    return {
      graphs: []
    }
  },
  mounted () {
    this.graphs = [{
      id: '1',
      type: 'bytes',
      data: {
        datasets: [{ label: 'Data name', data: [{x: 1272664800000, y: NaN}, {x: 1272672000000, y: 1160.852051282051}, {x: 1272679200000, y: 1254.6666666666667}, {x: 1272686400000, y: 1404.933888888889}, {x: 1272693600000, y: 1508.6666666666667}, {x: 1272700800000, y: 1656.1856944444444}, {x: 1272708000000, y: 1682.778611111111}, {x: 1272715200000, y: 1669.7697222222223}, {x: 1272722400000, y: 1659.3566666666666}, {x: 1272729600000, y: 1667.010416666667}] }]
      }
    }]
  }
}
</script>
