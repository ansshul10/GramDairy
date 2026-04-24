import api from '../lib/axios'

const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData)
    return response.data
  },

  getProductReviews: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`)
    return response.data
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`)
    return response.data
  },

  getAllReviews: async () => {
    const response = await api.get('/reviews')
    return response.data
  },
}

export default reviewService
