<template>
  <div class="row">
	  <div class="col-md-12">
		<object id="dashboard" data="/static/dash.svg" type="image/svg+xml"></object>	  
	  </div>
  </div>
</template>

<script>
var submitting = false

export default {
  name: 'status',
  mounted: function () {
    var vm = this
    var dashboard = document.getElementById('dashboard')
    dashboard.addEventListener('load', function () {
      update()
    }, false)
    function update () {
      if (submitting) {
        return
      }
      submitting = true

      vm.$http.get('/admin/status/overview').then(function (response) {
        submitting = false
        for (var property in response.data) {
          if (!response.data.hasOwnProperty(property)) {
            continue
          }
          var value = response.data[property]
          var color
          if (value.status === 'SUCCESS') {
            color = '#3c763d'
          } else if (value.status === 'ERROR') {
            color = '#a94442'
          } else {
            color = '#777'
          }

          var elem = dashboard.contentDocument.getElementById(property)
          if (elem !== null) {
            elem.style.fill = color
            if (value.status === 'ERROR') {
              elem.innerHTML = '<title>' + value.message + '</title>'
            } else {
              elem.innerHTML = ''
            }
          }
        }
      }).catch(function () {
        submitting = false
      })
    }
  }
}
</script>
