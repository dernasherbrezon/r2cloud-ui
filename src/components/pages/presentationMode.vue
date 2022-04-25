<template>
  <div class="row">
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-12">
            <svg id="svgRef" style="width: 100%; height: 400px;">
               <path fill-opacity="0.6" :d="worldPath"></path>
               <circle :cx="basestation.x" :cy="basestation.y" r="2px" fill="red"></circle>
               <template v-for="cur in satellites">
                   <path class="satelliteCircle" :fill="cur.color" fill-opacity="0.2" :d="cur.path">
                      <title>{{ cur.name }}&#xA;<br>{{ cur.timeHint }}</title>
                   </path>
                   <circle class="satelliteCircle" :cx="cur.x" :cy="cur.y" r="2px" :fill="cur.color"></circle>
               </template>
            </svg>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
			<table class="table table-hover">
	            <thead>
	              <tr>
	              	<th scope="col" style="width: 40%; border-top: 0px;">Name</th>
	                <th scope="col" style="border-top: 0px;">Date</th>
	                <th scope="col" style="width: 20%; border-top: 0px;">Frames</th>
	              </tr>
	            </thead>
	            <tbody>
	              <tr :class="rowColor(curData)" :key="curData.id" v-for="(curData, index) in observations">
	              	<template v-if="curData.status == 'RECEIVING_DATA'">
	              		<td>{{ curData.name }}</td>
	              		<td colspan="2">
							<div class="progress" style="height: 20px;">
							  <div class="progress-bar progress-bar-animated" role="progressbar" :style="'width: ' + formatReceive(curData) + '%'" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
							  	<span>{{ formatReceive(curData) }} %</span>
							  </div>
							</div>
	              		</td>
	              	</template>
	              	<template v-else-if="curData.status == 'RECEIVED'">
	              		<td>{{ curData.name }}</td>
	              		<td colspan="2">
							<div class="progress" style="height: 20px;">
							  <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 100%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
							  	<span>Decoding...</span>
							  </div>
							</div>
	              		</td>	
	              	</template>
	              	<template v-else-if="curData.status == 'NEW'">
		              	<td>{{ curData.name }}</td>
		              	<td>{{ format(curData.start) }}</td>
		                <td></td>
	              	</template>
	              	<template v-else>
		              	<td>{{ curData.name }}</td>
		              	<td><router-link :to="{ path: '/observation/load', query: { id: curData.id, satelliteId: curData.satelliteId, path: '/observation/load' }}">{{ format(curData.start) }}</router-link></td>
		                <td>{{ curData.numberOfDecodedPackets }}</td>
	              	</template>
	              </tr>
	            </tbody>
	         </table>        
        </div>
      </div>
	</div>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import * as satellite from 'satellite.js'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

export default {
  name: 'presentationMode',
  data () {
    return {
      observations: [],
      worldPath: '',
      basestation: {},
      satellites: [],
      timeoutFunction: '',
      nearestSatelliteStart: 0
    }
  },
  beforeRouteLeave (to, from, next) {
    clearTimeout(this.timeoutFunction)
    next()
  },  
  methods: {
    format (unixTimestamp) {
      var utcTime = moment(unixTimestamp).utc()
      return utcTime.format('DD-MMM-YYYY') + ' ' + utcTime.format('HH:mm')
    },
    formatReceive(observation) {
      return Math.round((moment().utc().valueOf() - observation.start) * 100 / (observation.end - observation.start));
    },
    rowColor (observation) {
      if (observation.hasData) {
        return 'table-success'
      }
      if( observation.status !== 'NEW' && observation.status !== 'RECEIVING_DATA' ) {
        return 'table-secondary'
      }
      return ''
    },
    hashcode(str, seed = 0) {
        let h1 = 0xdeadbeef ^ seed;
        let h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
        h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
        return 4294967296 * (2097151 & h2) + (h1>>>0);
    },
    getRandomColor(hash) {
      var colour = '#';
      for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
      }
      return colour;
    },
    reload(projection, path) {
      const vm = this
      if( vm.nearestSatelliteStart === 0 || vm.nearestSatelliteStart < Date.now()) {
        vm.$http.get('/presentationMode').then(function (response) {
           var baseStation = projection([response.data.basestation.lng, response.data.basestation.lat])
           vm.basestation = {
              x: baseStation[0],
              y: baseStation[1]
           }
           vm.nearestSatelliteStart = 0
           vm.observations = response.data.observations
           vm.reloadSvg(projection, path);
           vm.timeoutFunction = setTimeout(vm.reload, 10000, projection, path)
        })
      } else {
        vm.reloadSvg(projection, path);
        vm.timeoutFunction = setTimeout(vm.reload, 10000, projection, path)
      }
    },
    reloadSvg(projection, path) {
        const vm = this
        var currentDate = new Date()
        var gmst = satellite.gstime(currentDate)
        for( var i =0;i<vm.observations.length;i++) {
           console.log(vm.observations[i].status)
           if( vm.observations[i].status !== 'NEW' && vm.observations[i].status !== 'RECEIVING_DATA' ) {
               continue;
           }
           var satrec = satellite.twoline2satrec(vm.observations[i].tle.line2, vm.observations[i].tle.line3)
           var positionAndVelocity = satellite.propagate(satrec, currentDate);
           var positionGd    = satellite.eciToGeodetic(positionAndVelocity.position, gmst)
           var coreAngle = Math.acos(6.378135E3 / (6.378135E3 + positionGd.height)) / 1.74532925E-2
           var longitudeDeg = satellite.degreesLong(positionGd.longitude)
           var latitudeDeg  = satellite.degreesLat(positionGd.latitude)
           var circle = d3.geoCircle().center([longitudeDeg, latitudeDeg]).radius( coreAngle )()
           var centerXY = projection([longitudeDeg, latitudeDeg])
           var timeHint;
           if( vm.observations[i].start > Date.now() ) {
              timeHint = moment(vm.observations[i].start).fromNow();
           } else {
              timeHint = vm.observations[i].status;
           }
           Vue.set(vm.satellites, i, {
              color: vm.getRandomColor(vm.hashcode(vm.observations[i].id)),
              name: vm.observations[i].name,
              path: path(circle),
              timeHint: timeHint,
              x: centerXY[0],
              y: centerXY[1]
           });
           if( vm.nearestSatelliteStart === 0 || vm.nearestSatelliteStart > vm.observations[i].start ) {
               vm.nearestSatelliteStart = vm.observations[i].start
           }
        }
    }
  },  
  mounted () {
    const vm = this
    d3.json("/static/land-simple.json").then(function(world) {
      const land = topojson.feature(world, world.objects.land)
      const { height, width } = document.getElementById("svgRef").getBoundingClientRect()
      const projection = d3.geoMercator().fitExtent( [ [0, 0], [width, height + 120], ], land)
      var path = d3.geoPath().projection(projection)
      vm.worldPath = path(land)
      vm.reload(projection, path);
    })
  }
}
</script>

<style>
.satelliteCircle:hover {
	stroke: rgba(255, 0, 0, 0.4);
}
</style>