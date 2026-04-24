import api from '../lib/axios'

const productService = {
  getProducts: async (params) => {
    const response = await api.get('/products', { params })
    return response.data
  },

  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/${slug}`)
    return response.data
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  getCategories: async () => {
    const response = await api.get('/categories')
    return response.data
  },
}

export default productService
