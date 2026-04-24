import api from '../lib/axios'

const walletService = {
  getWallet: async () => {
    const response = await api.get('/wallet')
    return response.data
  },

  topUp: async (amount, transactionId = '') => {
    const response = await api.post('/wallet/topup', { amount, transactionId })
    return response.data
  },
}

export default walletService
