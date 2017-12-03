import axios from 'axios'

const HTTP = axios.create({
  baseURL: '/api/v1'
})

export default HTTP
