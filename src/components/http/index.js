import axios from 'axios'

const HTTP = axios.create({
  baseURL: 'https://r2.localhost/api/v1'
})
export default HTTP
