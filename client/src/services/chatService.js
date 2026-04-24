import axios from '../lib/axios';

const chatService = {
  getChatHistory: () => axios.get('/chat/history'),
  getActiveChat: () => axios.get('/chat/active'),
  getAdminActiveChats: () => axios.get('/chat/admin/active'),
  updateSupportStatus: (status) => axios.patch('/support/admin/status', { status }),
  getSupportStatus: () => axios.get('/support/admin/status')
};

export default chatService;
