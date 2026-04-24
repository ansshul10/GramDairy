import api from '../lib/axios'

const adminService = {
  // Categories
  createCategory: async (formData) => {
    const response = await api.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  updateCategory: async (id, formData) => {
    const response = await api.patch(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  },

  // Products
  createProduct: async (formData) => {
    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  updateProduct: async (id, formData) => {
    const response = await api.patch(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  // Dashboard Stats (Module 16 preview)
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats')
    return response.data
  },

  // User Management
  getAllUsers: async () => {
    const response = await api.get('/admin/users')
    return response.data
  },

  sendUserNotification: async (userId, data) => {
    const response = await api.post('/admin/notifications/send', { userId, ...data })
    return response.data
  },

  // Vendor Management
  getVendorApplications: async () => {
    const response = await api.get('/admin/vendors/applications')
    return response.data
  },

  approveVendorApplication: async (id) => {
    const response = await api.post(`/admin/vendors/approve/${id}`)
    return response.data
  },

  getVendorDetail: async (id) => {
    const response = await api.get(`/admin/vendors/${id}`)
    return response.data
  },

  updateVendorStatus: async (id, status) => {
    const response = await api.patch(`/admin/vendors/${id}/status`, { status })
    return response.data
  },

  deleteVendor: async (id) => {
    const response = await api.delete(`/admin/vendors/${id}`)
    return response.data
  },
}

export default adminService
