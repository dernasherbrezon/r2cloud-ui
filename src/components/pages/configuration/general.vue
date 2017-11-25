<template>
  <div class="row">
    <div class="col-md-12">
      <form style="margin-top: 20px;">
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="lat">Latitude</label>
              <input type="text" id="lat" class="form-control" required="" v-model="lat">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="lng">Longitude</label>
              <input type="text" id="lng" class="form-control" required="" v-model="lng">
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
                <label for="detect">&nbsp;</label>
                <button id="detect" type="button" class="btn btn-default" style="display: block;">Detect</button>
            </div>
          </div>
        </div>
        <div class="checkbox">
          <label>
            <input type="checkbox" v-model="autoUpdate"> Auto-update enabled
          </label>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>	              
      </form>
    </div>
  </div>
</template>

<script>

import HTTP from '@/components/http'

export default {
  name: 'general',
  data () {
    return {
      lat: 51.496620842979404,
      lng: 0.0120395141601486,
      autoUpdate: true
    }
  },
  methods: {
    save: function (event) {
    }
  },
  mounted () {
    console.log(HTTP)
  }
}
</script>
