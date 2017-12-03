var RotateIcon = function (options) {
  var icon = this
  this.options = options || {}
  this.rImg = options.img || new Image()
  this.rImg.addEventListener('load', function () {
    icon.options.width = icon.options.width || icon.rImg.width || 16
    icon.options.height = icon.options.height || icon.rImg.height || 16
    var canvas = document.createElement('canvas')
    canvas.width = icon.options.width
    canvas.height = icon.options.height
    icon.context = canvas.getContext('2d')
    icon.canvas = canvas
    options.callback()
  }, false)
  this.rImg.src = this.options.url
}

RotateIcon.prototype.setRotation = function (options) {
  var canvas = this.context
  var angle = options.deg ? options.deg * Math.PI / 180 : options.rad
  var centerX = this.options.width / 2
  var centerY = this.options.height / 2

  canvas.clearRect(0, 0, this.options.width, this.options.height)
  canvas.save()
  canvas.translate(centerX, centerY)
  canvas.rotate(angle)
  canvas.translate(-centerX, -centerY)
  canvas.drawImage(this.rImg, 0, 0)
  canvas.restore()
  return this
}
RotateIcon.prototype.getUrl = function () {
  var result = this.canvas.toDataURL('image/png')
  return result
}

export default RotateIcon
