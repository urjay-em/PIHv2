import axiosInstance from './axiosInstance';

const ClientService = {
  getAllClients: () => axiosInstance.get('/clients/'), 
  getClientById: (id) => axiosInstance.get(`/clients/${id}/`), 
  createClient: (clientData) => axiosInstance.post('/clients/', clientData), 
  updateClient: (id, clientData) => axiosInstance.put(`/clients/${id}/`, clientData), 
  deleteClient: (id) => axiosInstance.delete(`/clients/${id}/`), 
};

export default ClientService;