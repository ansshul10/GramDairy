import api from '../lib/axios'

const storeService = {
  // Public Endpoint
  getStores: async (params) => {
    const response = await api.get('/stores', { params })
    return response.data
  },

  // Admin Endpoints
  createStore: async (storeData) => {
    const response = await api.post('/admin/stores', storeData)
    return response.data
  },
  updateStore: async (id, storeData) => {
    const response = await api.put(`/admin/stores/${id}`, storeData)
    return response.data
  },
  deleteStore: async (id) => {
    const response = await api.delete(`/admin/stores/${id}`)
    return response.data
  }
}

export default storeService
