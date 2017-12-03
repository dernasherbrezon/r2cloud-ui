<template>
  <div class="row">
    <div class="col-sm-12 main">
      <div class="iframe-container" v-if="center.lat !== '' && center.lon !== ''">
        <gmap-map :center="center" :zoom="10" ref="map">
          <gmap-polyline v-for="item in paths" :key="item.icao24" :path="item.positions" :options="item.options" :editable="false"></gmap-polyline>
          <gmap-marker v-for="item in paths" :key="item.icao24" :title="item.icao24" :icon="icon(item)" :position="item.positions[item.positions.length - 1]"></gmap-marker>
        </gmap-map>
      </div>
      <p v-else style="text-align: center;">Latitude or Longitude on this station are not configured<br><br><router-link to="/admin/config/general">Settings</router-link></p>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import RotateIcon from '@/components/RotateIcon.js'
import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAT2lh-lYB8r8fLWUvcD2H7qDruoBm_Zdg'
  }
})

export default {
  name: 'airplanes',
  data () {
    return {
      center: {
        lat: '',
        lng: ''
      },
      paths: []
    }
  },
  mounted () {
    const vm = this
    vm.$http.get('/admin/config/general').then(function (response) {
      vm.center.lat = parseFloat(response.data.lat)
      vm.center.lng = parseFloat(response.data.lng)
      VueGoogleMaps.loaded.then(() => {
        vm.rotateIcon = new RotateIcon({
          url: '/static/airplane.png',
          callback: vm.update
        })
      })
    })
  },
  methods: {
    calculateRotationDegree ($path) {
      if ($path.length < 2) {
        return 0
      }
      var y = $path[$path.length - 1].lat - $path[$path.length - 2].lat
      var x = $path[$path.length - 1].lng - $path[$path.length - 2].lng
      var degree = Math.atan(Math.abs(y / x)) * 180 / Math.PI

      var result
      if (y < 0 && x > 0) {
        result = 90 + degree
      } else if (y < 0 && x < 0) {
        result = 270 - degree
      } else if (y > 0 && x < 0) {
        result = 360 - degree
      } else {
        result = 90 - degree
      }
      return result
    },
    icon (item) {
      return {
        url: this.rotateIcon.setRotation({
          deg: this.calculateRotationDegree(item.positions)
        }).getUrl(),
        anchor: new google.maps.Point(8, 8) // eslint-disable-line no-undef
      }
    },
    update () {
      const vm = this
      vm.$http.get('/admin/adsb').then(function (response) {
        vm.paths = []
        var data = response.data
        for (var i in data) {
          data[i].options = {
            strokeColor: '#' + data[i].icao24,
            strokeOpacity: 1.0,
            strokeWeight: 1
          }
          vm.paths.push(data[i])
        }
        setTimeout(vm.update, 1000)
      }).catch(function (error) {
        vm.handleError(vm, error)
      })
    }
  }
}
</script>

<style type="text/css">
.iframe-container{
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; /* Ratio 16:9 ( 100%/16*9 = 56.25% ) */
}
.iframe-container > *{
    display: block;
    position: absolute !important;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
}
</style>
