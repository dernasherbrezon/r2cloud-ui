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
              unit: 'minute',
              tooltipFormat: 'HH:mm'
            }
          }]
        },
        legend: {
          onClick: (e) => e.stopPropagation()
        }
      })
  }
}
