import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: ['data', 'id'],
  name: 'timeSeries',
  mounted () {
    this.renderChart(this.data,
      {
        elements: {
          line: {
            tension: 0 // disables bezier curves
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
