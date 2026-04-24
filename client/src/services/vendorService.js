import api from '../lib/axios'

const vendorService = {
  // Vendor Terminal Stats
  getDashboardStats: async () => {
    const response = await api.get('/vendor/stats')
    return response.data
  },

  // Product Management (Limited to their own products)
  getMyProducts: async () => {
    const response = await api.get('/vendor/products')
    return response.data
  },

  // Supply History
  getSupplyHistory: async () => {
    const response = await api.get('/vendor/supplies')
    return response.data
  }
}

export default vendorService
