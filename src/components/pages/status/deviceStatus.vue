<template>
	<span class="float-right"><i :class="batteryIcon" aria-hidden="true" v-if="device.batteryLevel"></i>&nbsp;<i :class="signalIcon" v-if="device.signalLevel">
	<span class="bar-1"></span>
	<span class="bar-2"></span>
	<span class="bar-3"></span>
	<span class="bar-4"></span>
</i></span>
</template>

<script>

export default {
  name: 'device',
  props: ['device'],
  computed: {
    batteryIcon: function () {
      if (this.device.batteryLevel > 75) {
        return 'fa fa-battery-4'
      } else if (this.device.batteryLevel > 50) {
        return 'fa fa-battery-3'
      } else if (this.device.batteryLevel > 25) {
        return 'fa fa-battery-2'
      } else if (this.device.batteryLevel > 10) {
        return 'fa fa-battery-1'
      } else {
        return 'fa fa-battery-0'
      }
    },
    signalIcon: function() {
      // each bluetooth chip has different "good" signal level in db
      // taken from https://www.cnet.com/how-to/how-to-check-bluetooth-connection-strength-in-os-x/
      if (this.device.signalLevel > -60) {
        return 'icon__signal-strength signal-4'
      } else if (this.device.signalLevel > -70) {
        return 'icon__signal-strength signal-3'
      } else if (this.device.signalLevel > -90) {
        return 'icon__signal-strength signal-2'
      } else {
        return 'icon__signal-strength signal-1'
      }
    }
  }
}

</script>
<style>
.icon__signal-strength {
  display: inline-flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: auto;
  height: 16px;
  padding: 0px;
}

.icon__signal-strength span {
  display: inline-block;
  width: 3px;
  margin-left: 2px;
  transform-origin: 100% 100%;
  background-color: #28a745;
  border-radius: 1px;
  animation-iteration-count: 1;
  animation-timing-function: cubic-bezier(0.17, 0.67, 0.42, 1.3);
  animation-fill-mode: both;
  animation-play-state: paused;
}

.icon__signal-strength .bar-1 {
  height: 25%;
  animation-duration: 0.3s;
  animation-delay: 0.1s;
}
.icon__signal-strength .bar-2 {
  height: 50%;
  animation-duration: 0.25s;
  animation-delay: 0.2s;
}
.icon__signal-strength .bar-3 {
  height: 75%;
  animation-duration: 0.2s;
  animation-delay: 0.3s;
}
.icon__signal-strength .bar-4 {
  height: 100%;
  animation-duration: 0.15s;
  animation-delay: 0.4s;
}

.signal-0 .bar-1,
.signal-0 .bar-2,
.signal-0 .bar-3,
.signal-0 .bar-4 {
  opacity: 0.2;
}

.signal-1 .bar-2,
.signal-1 .bar-3,
.signal-1 .bar-4 {
  opacity: 0.2;
}

.signal-2 .bar-3,
.signal-2 .bar-4 {
  opacity: 0.2;
}

.signal-3 .bar-4 {
  opacity: 0.2;
}

@keyframes signal-intro {
  from {
    opacity: 0.2;
    height: 2px;
  }
}
</style>
