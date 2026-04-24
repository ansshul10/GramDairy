import api from '../lib/axios'

const newsletterService = {
  subscribe: async (email) => {
    const response = await api.post('/public/newsletter/subscribe', { email })
    return response.data
  },
  unsubscribe: async (email) => {
    const response = await api.post('/public/newsletter/unsubscribe', { email })
    return response.data
  },
  getSubscribers: async () => {
    const response = await api.get('/admin/newsletter')
    return response.data
  },
  sendBlast: async (subject, message) => {
    const response = await api.post('/admin/newsletter/send', { subject, message })
    return response.data
  }
}

export default newsletterService
