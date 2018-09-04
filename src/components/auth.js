import axios from 'axios'

function User () {
  this.token = localStorage.getItem('access_token')
  if (this.token) {
    this.authenticated = true
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token
  } else {
    this.authenticated = false
  }
  this.redirect = ''
  var storedValue = localStorage.getItem('generalSetup')
  if (!storedValue || storedValue === 'false') {
    this.generalSetup = false
  } else {
    this.generalSetup = true
  }
}

User.prototype.authenticate = function authenticate (token) {
  this.authenticated = true
  this.token = token
  localStorage.setItem('access_token', token)
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

User.prototype.logout = function logout () {
  this.authenticated = false
  localStorage.removeItem('access_token')
  delete axios.defaults.headers.common['Authorization']
}

User.prototype.setGeneralSetup = function setGeneralSetup (status) {
  this.generalSetup = status
  localStorage.setItem('generalSetup', status)
}

var user = new User()

module.exports = user
