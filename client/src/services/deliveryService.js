import api from '../lib/axios'

const deliveryService = {
  // --- Delivery Boy Operations ---
  getAssignedOrders: async () => {
    const response = await api.get('/delivery/orders')
    return response.data
  },

  scanQr: async (token) => {
    const response = await api.post('/delivery/scan', { token })
    return response.data
  },

  generateDeliveryOtp: async (id) => {
    const response = await api.post(`/delivery/otp/${id}`)
    return response.data
  },

  verifyDelivery: async (id, otp) => {
    const response = await api.post(`/delivery/verify/${id}`, { otp })
    return response.data
  },

  updateLocation: async (location) => {
    const response = await api.post('/delivery/location', location)
    return response.data
  },

  getDeliveryHistory: async () => {
    const response = await api.get('/delivery/history')
    return response.data
  },

  getMyProfile: async () => {
    const response = await api.get('/delivery/me')
    return response.data
  },

  // --- Public Operations ---
  applyForDelivery: async (formData) => {
    const response = await api.post('/delivery/apply', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  getPublicProfile: async (id) => {
    // No auth header needed for this public route
    const response = await api.get(`/delivery/public/verify/${id}`)
    return response.data
  },

  rateDeliveryBoy: async (id, rating) => {
    const response = await api.post(`/delivery/public/rate/${id}`, { rating })
    return response.data
  },

  // --- Admin Operations ---
  getApplications: async (status) => {
    const response = await api.get('/delivery/applications', { params: { status } })
    return response.data
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/delivery/applications/${id}`)
    return response.data
  },

  approveApplication: async (id) => {
    const response = await api.post(`/delivery/applications/${id}/approve`)
    return response.data
  },

  rejectApplication: async (id, reason) => {
    const response = await api.post(`/delivery/applications/${id}/reject`, { reason })
    return response.data
  },

  getDeliveryBoys: async () => {
    const response = await api.get('/delivery/boys')
    return response.data
  },

  getDeliveryBoyById: async (id) => {
    const response = await api.get(`/delivery/boys/${id}`)
    return response.data
  },

  updateDeliveryBoyStatus: async (id, status) => {
    const response = await api.patch(`/delivery/boys/${id}/status`, { status })
    return response.data
  },

  contactDeliveryBoy: async (id, subject, message) => {
    const response = await api.post(`/delivery/boys/${id}/contact`, { subject, message })
    return response.data
  },

  deleteDeliveryBoy: async (id) => {
    const response = await api.delete(`/delivery/boys/${id}`)
    return response.data
  },
}

export default deliveryService
