var RotateIcon = function (options) {
  this.options = options || {}
  this.rImg = options.img || new Image()
  this.rImg.src = this.options.url
  this.rImg.addEventListener('load', function () {
    options.callback()
  }, false)
  this.options.width = this.options.width || this.rImg.width || 16
  this.options.height = this.options.height || this.rImg.height || 16
  var canvas = document.createElement('canvas')
  canvas.width = this.options.width
  canvas.height = this.options.height
  this.context = canvas.getContext('2d')
  this.canvas = canvas
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
