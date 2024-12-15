import axiosInstance from './axiosInstance';

const AgentService = {
  getAllAgents: () => axiosInstance.get('/agents/'),
  getAgentById: (id) => axiosInstance.get(`/agents/${id}/`),
  createAgent: (agentData) => axiosInstance.post('/agents/', agentData),
  updateAgent: (id, agentData) => axiosInstance.put(`/agents/${id}/`, agentData),
  deleteAgent: (id) => axiosInstance.delete(`/agents/${id}/`),
};

export default AgentService;
