import api from '../lib/axios'

const couponService = {
  getCoupons: async () => {
    const response = await api.get('/coupons')
    return response.data
  },

  getActiveCoupons: async () => {
    const response = await api.get('/coupons/active')
    return response.data
  },

  createCoupon: async (couponData) => {
    const response = await api.post('/coupons', couponData)
    return response.data
  },

  validateCoupon: async (code, amount) => {
    const response = await api.post('/coupons/validate', { code, amount })
    return response.data
  },

  deleteCoupon: async (id) => {
    const response = await api.delete(`/coupons/${id}`)
    return response.data
  }
}

export default couponService
