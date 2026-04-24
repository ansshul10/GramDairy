import api from '../lib/axios'

const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/myorders')
    return response.data
  },

  payOrder: async (id, paymentResult) => {
    const response = await api.patch(`/orders/${id}/pay`, paymentResult)
    return response.data
  },

  getAllOrders: async () => {
    const response = await api.get('/orders')
    return response.data
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status })
    return response.data
  },
}

export default orderService
