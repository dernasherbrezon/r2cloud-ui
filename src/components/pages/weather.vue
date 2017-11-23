<template>
  <div class="row">
    <div class="col-md-12">
      <b-tabs no-fade>
        <b-tab :title="item.name" :active="index === 0" :key="item.id" v-for="(item, index) in satellites">
          <div style="margin-top: 20px;">
            <p>Next pass: <strong>{{ formatTime(item.nextPass) }}</strong> {{ formatDate(item.nextPass) }} UTC</p>
            <b-tabs pills no-fade>
              <b-tab :title="formatTime(curData.date) + ' ' + formatDate(curData.date)" :active="curDataIndex === 0" v-for="(curData,curDataIndex) in item.data">
                <div class="row" style="margin-top: 20px;">
                  <div class="col-md-6">
                      <img class="img-fluid" :src="curData.aPath">
                  </div>
                  <div class="col-md-6">
                      <img class="img-fluid" :src="curData.bPath">
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </div>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>

import moment from 'moment'

export default {
  name: 'weather',
  data () {
    return {
      satellites: [
        {
          id: '1',
          nextPass: 1272668400000,
          name: 'NOAA 18',
          data: [
            {
              date: 1271668400000,
              aPath: '/static/a.jpg',
              bPath: '/static/b.jpg'
            },
            {
              date: 1273668400000,
              aPath: '',
              bPath: ''
            },
            {
              date: 1274668400000,
              aPath: '',
              bPath: ''
            }
          ]
        },
        {
          id: '2',
          nextPass: 1272268400000,
          name: 'NOAA 15',
          data: [
            {
              date: 1272368400000,
              aPath: '',
              bPath: ''
            },
            {
              date: 1272468400000,
              aPath: '',
              bPath: ''
            },
            {
              date: 1272968400000,
              aPath: '',
              bPath: ''
            }
          ]
        },
        {
          id: '3',
          nextPass: 1272668400000,
          name: 'NOAA 19',
          data: [
            {
              date: 1272668400000,
              aPath: '',
              bPath: ''
            },
            {
              date: 1272568400000,
              aPath: '',
              bPath: ''
            },
            {
              date: 1272468400000,
              aPath: '',
              bPath: ''
            }
          ]
        }]
    }
  },
  methods: {
    formatDate (unixTimestamp) {
      return moment(unixTimestamp).utc().format('DD-MMM-YYYY')
    },
    formatTime (unixTimestamp) {
      return moment(unixTimestamp).utc().format('HH:mm')
    }
  }
}
</script>
