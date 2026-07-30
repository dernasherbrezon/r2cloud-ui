<template>
  <div class="col-md-12">
    <canvas id="canvas" ref="canvasRef" style="cursor: crosshair; border: 1px solid #ccc; image-rendering: pixelated; image-rendering: crisp-edges;" class="img-fluid" @mousemove="handleMouseMove" @mouseleave="hidePopup"></canvas>
    <div
      v-if="showPopup"
      ref="popupRef"
      class="spectrogram-popup"
      :style="popupStyle"
    >
      <div class="popup-content">
        <div><strong>Time:</strong> {{ popupData.time }}</div>
        <div><strong>Frequency:</strong> {{ popupData.freq.toFixed(3) }} MHz</div>
        <div><strong>Power:</strong> {{ popupData.power }} dB</div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: ['src', 'minFreq', 'maxFreq', 'startTime', 'endTime'],
  name: 'spectogram',
  data () {
    return {
      paletteMin: 0,
      paletteMax: 0,
      palette: [],
      showPopup: false,
      popupData: {
        time: 0,
        freq: 0,
        power: 0
      },
      mousePos: {
        x: 0,
        y: 0
      },
      originalData: null,
      canvas: null,
      timeStep: 0
    }
  },
  computed: {
    popupStyle() {
      return {
        position: 'absolute',
        left: `${this.mousePos.x + 25}px`,
        top: `${this.mousePos.y - 55}px`,
        zIndex: 1000,
        background: '#1e1e1e',
        color: '#fff',
        border: '1px solid #555',
        borderRadius: '6px',
        padding: '8px 12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        fontSize: '13px',
        pointerEvents: 'none', // important so mouse events go to canvas
        whiteSpace: 'nowrap'
      }
    }
  },
  methods: {
    handleMouseMove(e) {
      const vm = this;
      if (!vm.canvas) return;
      if (!vm.originalData) return;
      
      const rect = vm.canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      vm.mousePos = { x, y }
      const dataX = Math.floor((vm.mousePos.x / rect.width) * vm.canvas.width);
      const dataY = Math.floor((vm.mousePos.y / rect.height) * vm.canvas.height);
      const index = dataY * vm.canvas.width + dataX;
      vm.popupData = {
        time: moment(vm.endTime - vm.mousePos.y * (vm.endTime - vm.startTime) / rect.height).utc().format('HH:mm:ss'),
        freq: (vm.minFreq + vm.mousePos.x * (vm.maxFreq - vm.minFreq) / rect.width) / 1000000,
        power: vm.originalData[4 * index] - 255
      }
      
      vm.showPopup = true
    },
    hidePopup() {
      this.showPopup = false
    },
    parsePngHeader(arrayBuffer) {
      const view = new DataView(arrayBuffer);
      
      // PNG signature check (8 bytes)
      if (view.getUint32(0) !== 0x89504E47 || view.getUint32(4) !== 0x0D0A1A0A) {
        throw new Error('Not a valid PNG file');
      }

      // IHDR chunk starts at byte 8
      // Length (4 bytes) + "IHDR" (4 bytes) + data (13 bytes)
      const ihdrOffset = 16; // after signature + length + chunk type
      
      const width       = view.getUint32(ihdrOffset);
      const height      = view.getUint32(ihdrOffset + 4);
      const bitDepth    = view.getUint8(ihdrOffset + 8);
      const colorType   = view.getUint8(ihdrOffset + 9);
      const compression = view.getUint8(ihdrOffset + 10);
      const filter      = view.getUint8(ihdrOffset + 11);
      const interlace   = view.getUint8(ihdrOffset + 12);

      let colorModel = '';
      switch (colorType) {
        case 0: colorModel = 'Grayscale'; break;
        case 2: colorModel = 'RGB'; break;
        case 3: colorModel = 'Indexed (Palette)'; break;
        case 4: colorModel = 'Grayscale + Alpha'; break;
        case 6: colorModel = 'RGBA'; break;
        default: colorModel = 'Unknown';
      }

      return {
        width,
        height,
        bitDepth,
        colorType,
        colorModel,
        hasAlpha: colorType === 4 || colorType === 6,
        isGrayscale: colorType === 0 || colorType === 4,
        compressionMethod: compression,
        filterMethod: filter,
        interlaceMethod: interlace
      };
    },
    calculateRgb(value) {
      const vm = this;
      if(value >= vm.paletteMax) {
        return vm.palette[vm.palette.length-1];
      } else if(value <= vm.paletteMin) {
        return vm.palette[0];
      }
      let index = Math.floor((value - vm.paletteMin) / vm.paletteStep);
      if(index === vm.palette.length-1) {
        return vm.palette[vm.palette.length-1];
      }
      let from = vm.palette[index];
      let to = vm.palette[index+1];
      let remainder = (value - vm.paletteMin) % vm.paletteStep;
      if(remainder === 0) {
        return from;
      }
      let percent = remainder / vm.paletteStep;
      let r = from[0] + percent * (to[0] - from[0]);
      let g = from[1] + percent * (to[1] - from[1]);
      let b = from[2] + percent * (to[2] - from[2]);
      return [r, g, b];
    }
  },
  mounted () {
      const vm = this
      vm.$http.get(this.src, { baseURL: null, responseType: 'arraybuffer' }).then(function (response) {
        vm.canvas = document.getElementById('canvas');
        const ctx = vm.canvas.getContext('2d');
        const header = vm.parsePngHeader(response.data);
        const img = new Image();
        img.onload = () => {
          vm.canvas.width = img.width;
          vm.canvas.height = img.height;
          
          vm.timeStep = Math.floor((vm.endTime - vm.startTime) / img.height);
          
          ctx.drawImage(img, 0, 0);
          if(!header.isGrayscale) {
            return;
          }
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;
          vm.originalData = data.slice();
          
          var sum = 0;
          var tempResultsSize = 0;
          for (let j = 0; j < data.length; j += 4) {
              sum += ((data[j] & 0xFF) - 255); 
              tempResultsSize++;
          }
          
          var mean = sum / tempResultsSize;
          var standardDeviation = 0;
          for (let j = 0; j < data.length; j += 4) {
            var curValue = ((data[j] & 0xFF) - 255);
            standardDeviation += Math.pow(curValue - mean, 2);
          }
          standardDeviation = Math.sqrt(standardDeviation / tempResultsSize);
          vm.paletteMin = mean - 2 * standardDeviation;
          vm.paletteMax = mean + 6 * standardDeviation;
          var baseColors = [0x000000, 0x0000e7, 0x0094ff, 0x00ffb8, 0x2eff00, 0xffff00, 0xff8800, 0xff0000, 0xff007c];
          for (let j = 0; j < baseColors.length; j++) {
            let r = (baseColors[j] >> 16) & 0xFF;
            let g = (baseColors[j] >> 8) & 0xFF;
            let b = (baseColors[j] >> 0) & 0xFF;
            vm.palette.push([r, g, b]);
          }
          vm.paletteStep = (vm.paletteMax - vm.paletteMin) / (vm.palette.length - 1);
          for (let j = 0; j < data.length; j += 4) {
            let rgb = vm.calculateRgb(data[j] - 255);
            data[j] = rgb[0];
            data[j+1] = rgb[1];
            data[j+2] = rgb[2];
            data[j+3] = 0xFF;
          }
          ctx.putImageData(imageData, 0, 0);
        };
        img.src = URL.createObjectURL(new Blob([response.data], { type: 'image/png' }));
      }).catch(function (error) {
        console.log(error)
      })
  }
}
</script>