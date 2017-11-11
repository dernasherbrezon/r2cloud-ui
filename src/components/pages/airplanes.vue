<template>
  <div class="row">
    <div class="col-sm-12 main">
      <div class="iframe-container" v-if="center.lat !== '' && center.lon !== ''">
        <gmap-map
		  :center="center"
		  :zoom="10"
		></gmap-map>
      </div>
      <p v-else style="text-align: center;">Latitude or Longitude on this station are not configured<br><br><a href="/admin/config" class="btn btn-default">Settings</a></p>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
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
        lat: 51.496620842979404,
        lng: 0.0120395141601486
      }
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
