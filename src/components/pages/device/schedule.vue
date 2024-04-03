<template>
  <div class="row">
    <div class="col-md-12">
      <h1 class="pb-2 mb-2 border-bottom">Schedule</h1>
    </div>
    <div class="col-md-12">
		<svg :height="svgHeight()" :width="svgWidth()" xmlns="http://www.w3.org/2000/svg">
		  <line :x1="cur.x1" :y1="cur.y1" :x2="cur.x2" :y2="cur.y2" style="stroke:black;" :style="'stroke-width:' + cur.strokeWidth" v-for="(cur, index) in ticks" />
		  <text :x="cur.x" :y="cur.y" v-for="(cur, index) in tickLabels">{{ cur.text }}</text>
		  <rect :x="cur.x" :y="cur.y" :width="cur.width" :height="cur.height" style="stroke:black;" :style="'fill:' + cur.color" v-for="(cur, index) in blocks" />
		  <text :x="cur.x" :y="cur.y" fill="rgb(0, 0, 0)" text-anchor="middle" v-for="(cur, index) in blocksLabels">{{ cur.text }}</text>
		</svg>
  	</div>
  </div>
</template>
<script>
export default {
  name: 'schedule',
  data () {
    return {
      offsetX: 45,
      offsetY: 10,
      tickInterval: 5,
      blockWidth: 180,
      blockBorderWidth: 1,
      rulerWidth: 20,
      ticks: [],
      tickLabels: [],
      blocks: [],
      blocksLabels: [],
      marginTopBottom: 5,
      start: 0,
      end: 0,
      loading: true
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    svgWidth () {
      return this.offsetX + this.rulerWidth + this.blockWidth + this.blockBorderWidth;
    },
    svgHeight () {
      return ((this.end - this.start) / (60 * 1000) / 2) * 5 + this.marginTopBottom * 2;
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
    loadData () {
      const vm = this
      vm.$http.get('/admin/device/schedule', { params: { id: vm.$route.query.id } }).then(function (response) {
        if( response.data.length === 0 ) {
          vm.loading = false;
          return;
        }
        var twoMinutes = 2 * 60 * 1000.0;
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].start = (Math.round(response.data[i].start / twoMinutes)) * twoMinutes;
          response.data[i].end = (Math.round(response.data[i].end / twoMinutes)) * twoMinutes;
        }
        vm.start = response.data[0].start - 2 * 60 * 1000;
        vm.end = response.data[response.data.length - 1].end + 2 * 60 * 1000;
        var ticks = [];
        var tickLabels = [];
        var blocks = [];
        var blocksLabels = [];
        var j = 0;
        var k = 0;
        for( i = vm.start;i<=vm.end;i+=twoMinutes, k++) {
          var curDate = new Date(i);
          var minute = curDate.getUTCMinutes();
          var hour = curDate.getUTCHours();
          var y = vm.offsetY + k * vm.tickInterval;
          var x1 = vm.offsetX;
          var x2 = vm.offsetX + vm.rulerWidth;
          var strokeWidth = 1;
          if( minute === 0 ) {
            strokeWidth = 2;
          } else if( minute % 10 === 0 ) {
            x1 += 5;
          } else {
            x1 += 10;
          }
          ticks.push({ x1: x1, x2: x2, y1: y, y2: y, strokeWidth: strokeWidth });
          if( minute === 0 ) {
            var hourstr = '' + hour;
            var minutestr = '' + minute;
            tickLabels.push({ y: y + 5, text: hourstr.padStart(2, '0') + ':' + minutestr.padStart(2, '0') });
          }
          if ( j < response.data.length && i === response.data[j].start ) {
            var curSlot = response.data[j];
            var durationTwoMinutes = ((curSlot.end - curSlot.start) / twoMinutes) * vm.tickInterval;
            blocks.push({ x: x2, y: y, width: vm.blockWidth, height: durationTwoMinutes, color: vm.getRandomColor(vm.hashcode(curSlot.satelliteId)) });
            blocksLabels.push({ x: (x2 + vm.blockWidth / 2), y: (y + durationTwoMinutes / 2 + 5), text: curSlot.name });
          }
          while( j < response.data.length && i > response.data[j].start) {
            j++;
          }
        }
        vm.ticks = ticks;
        vm.blocks = blocks;
        vm.tickLabels = tickLabels;
        vm.blocksLabels = blocksLabels;
        vm.loading = false;
      })
    }
  }
}
</script>
