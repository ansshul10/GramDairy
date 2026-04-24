import api from '../lib/axios'

const subscriptionService = {
  getMySubscriptions: async () => {
    const response = await api.get('/subscriptions')
    return response.data
  },

  createSubscription: async (subData) => {
    const response = await api.post('/subscriptions', subData)
    return response.data
  },

  updateSubscription: async (id, data) => {
    const response = await api.patch(`/subscriptions/${id}`, data)
    return response.data
  },

  getAllSubscriptions: async () => {
    const response = await api.get('/subscriptions/all')
    return response.data
  },

  requestReactivation: async (id, message) => {
    const response = await api.post(`/subscriptions/request-reactivation/${id}`, { message })
    return response.data
  },
  
  getSubscriptionSnapshot: async (id, month, year) => {
    let url = `/subscriptions/${id}/snapshot`
    if (month && year) {
        url += `?month=${month}&year=${year}`
    }
    const response = await api.get(url)
    return response.data
  },

  setDayOverride: async (id, date, action, quantity = 1) => {
    const response = await api.post(`/subscriptions/${id}/day-override`, { date, action, quantity })
    return response.data
  },

  setVacationMode: async (id, startDate, endDate, active = true) => {
    const response = await api.post(`/subscriptions/${id}/vacation`, { startDate, endDate, active })
    return response.data
  },
}

export default subscriptionService
