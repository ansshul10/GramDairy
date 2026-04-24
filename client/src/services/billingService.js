import api from '../lib/axios'

const billingService = {
  // User Actions
  getInvoiceHistory: async () => {
    const response = await api.get('/billing/history')
    return response.data
  },
  
  getMyBills: async () => {
    const response = await api.get('/billing/my-bills')
    return response.data
  },

  submitPaymentProof: async (id, proofData) => {
    const response = await api.patch(`/billing/submit-proof/${id}`, proofData)
    return response.data
  },

  // Admin Actions
  generateMonthlyBills: async (data) => {
    const response = await api.post('/billing/generate', data)
    return response.data
  },

  getAllBills: async (status = '') => {
    const response = await api.get(`/billing/all${status ? `?status=${status}` : ''}`)
    return response.data
  },

  verifyPayment: async (id, status) => {
    const response = await api.patch(`/billing/verify/${id}`, { status })
    return response.data
  }
}

export default billingService
