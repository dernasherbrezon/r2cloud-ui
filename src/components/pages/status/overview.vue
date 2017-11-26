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
    var dashboard = document.getElementById('dashboard')
    dashboard.addEventListener('load', function () {
      update()
    }, false)
    function update () {
      if (submitting) {
        return
      }
      submitting = true

      this.$http.get('/admin/status/overview').then(function (response) {
        console.log(response.data)
      })
      var value = {status: 'ERROR', message: 'Error message'}
      var color
      var property = 'rtldongle'
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
  }
}
</script>
