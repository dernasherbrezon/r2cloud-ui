import { Line, mixins } from 'vue-chartjs'

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ['chartData', 'id', 'scale', 'format'],
  name: 'timeSeries',
  mounted () {
    const vm = this
    this.renderChart(this.chartData,
      {
        animation: false,
        elements: {
          line: {
            tension: 0 // disables bezier curves
          },
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 5
          }
        },
        responsive: true,
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: this.scale,
              displayFormats: {
                hour: 'H:mm'
              }
            }
          }],
          yAxes: [{
            ticks: {
              callback: function (label, index, labels) {
                return vm.formatYValue(label)
              },
              beginAtZero: true
            }
          }]
        },
        tooltips: {
          callbacks: {
            title: function () {
              return ''
            },
            label: function (tooltipItem) {
              return vm.formatYValue(tooltipItem.yLabel)
            }
          }
        },
        legend: {
          onClick: (e) => e.stopPropagation()
        }
      })
  },
  methods: {
    formatYValue: function (label) {
      if (this.format === 'BYTES') {
        if (label < 1024) {
          return label.toFixed(2) + ' B'
        } else if (label < 1024 * 1024) {
          return (label / 1024).toFixed(2) + ' KiB'
        } else if (label < 1024 * 1024 * 1024) {
          return (label / 1024 / 1024).toFixed(2) + ' MiB'
        }
      }
      return label.toFixed(2)
    }
  }
}
