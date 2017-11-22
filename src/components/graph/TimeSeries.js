import { Line, mixins } from 'vue-chartjs'

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ['chartData', 'id'],
  name: 'timeSeries',
  mounted () {
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
              unit: 'day'
            }
          }]
        },
        tooltips: {
          callbacks: {
            title: function () {
              return ''
            },
            label: function (tooltipItem) {
              return tooltipItem.yLabel
            }
          }
        },
        legend: {
          onClick: (e) => e.stopPropagation()
        }
      })
  }
}
