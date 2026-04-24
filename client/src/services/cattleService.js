import api from '../lib/axios'

const cattleService = {
  getAllCattle: async () => {
    const response = await api.get('/cattle')
    return response.data
  },

  getCattleById: async (id) => {
    const response = await api.get(`/cattle/${id}`)
    return response.data
  },

  getPrivateInfo: async (id, password) => {
    const response = await api.post(`/cattle/${id}/private`, { password })
    return response.data
  },

  createCattle: async (cattleData) => {
    const response = await api.post('/cattle', cattleData)
    return response.data
  },

  updateCattle: async (id, cattleData) => {
    const response = await api.patch(`/cattle/${id}`, cattleData)
    return response.data
  },
}

export default cattleService
