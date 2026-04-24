import api from '../lib/axios'

const settingService = {
  getSettings: async () => {
    const response = await api.get('/settings')
    return response.data
  },
  updateSettings: async (settingsData) => {
    const response = await api.put('/settings', settingsData)
    return response.data
  }
}

export default settingService
