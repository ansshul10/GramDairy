import api from '../lib/axios'

const publicService = {
  getSystemStatus: async () => {
    const response = await api.get('/public/status')
    return response.data
  },
  submitVendorApplication: async (data) => {
    const response = await api.post('/public/vendor/apply', data)
    return response.data
  }
}

export default publicService
