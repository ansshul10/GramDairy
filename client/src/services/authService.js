import api from '../lib/axios'

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  verifyOtp: async (otpData) => {
    const response = await api.post('/auth/verify-otp', otpData)
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData)
    return response.data
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh-token')
    return response.data
  },

  updateProfile: async (userData) => {
    const response = await api.patch('/auth/profile', userData)
    return response.data
  },

  getProfileStats: async () => {
    const response = await api.get('/auth/profile/stats')
    return response.data
  },

  getSessions: async () => {
    const response = await api.get('/auth/profile/sessions')
    return response.data
  },

  revokeAllSessions: async () => {
    const response = await api.delete('/auth/profile/sessions')
    return response.data
  },

  deleteAccount: async (confirmation) => {
    const response = await api.post('/auth/profile/delete-account', { confirmation })
    return response.data
  },

  setup2FA: async () => {
    const response = await api.get('/auth/2fa/setup')
    return response.data
  },

  enable2FA: async (data) => {
    const response = await api.post('/auth/2fa/enable', data)
    return response.data
  },

  disable2FA: async (password) => {
    const response = await api.post('/auth/2fa/disable', { password })
    return response.data
  },

  verifyMfaLogin: async (data) => {
    const response = await api.post('/auth/login/mfa', data)
    return response.data
  },
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

export default authService
