import API from '../lib/axios';

const createTicket = async (data) => {
  const response = await API.post('/support', data);
  return response.data;
};

const getMyTickets = async () => {
  const response = await API.get('/support/my-tickets');
  return response.data;
};

const trackTicket = async (ticketId, email) => {
  const response = await API.post('/support/track', { ticketId, email });
  return response.data;
};

const getAllTickets = async (params = {}) => {
  const response = await API.get('/support/admin/all', { params });
  return response.data;
};

const replyToTicket = async (id, data) => {
  const response = await API.post(`/support/admin/reply/${id}`, data);
  return response.data;
};

const updateTicket = async (id, data) => {
  const response = await API.patch(`/support/admin/${id}`, data);
  return response.data;
};

const supportService = {
  createTicket,
  getMyTickets,
  trackTicket,
  getAllTickets,
  replyToTicket,
  updateTicket
};

export default supportService;
