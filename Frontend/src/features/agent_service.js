import axiosInstance from './axiosInstance';

const AgentService = {
  getAllAgents: () => axiosInstance.get('/agents/'),
  getAgentById: (id) => axiosInstance.get(`/agents/${id}/`),
  createAgent: (agentData) => axiosInstance.post('/agents/', agentData),
  deleteAgent: (id) => axiosInstance.delete(`/agents/${id}/`),

  // Single update method for Agent and Profile
  updateAgent: (id, agentData) => {
    const profile = agentData.profile || {};

    const cleanNumber = (value) => {
      return value === "" || value === undefined ? null : Number(value);
    };

    const dataToSend = {
      // Data for the AgentDetails model
      hire_date: agentData.hire_date, // Assuming this is directly in agentData
      commission_rate: agentData.commission_rate,
      clients_managed: agentData.clients_managed,

      // Profile data for the related Profile model
      profile: {
        id: profile.id,
        first_name: profile.first_name || "",
        middle_name: profile.middle_name || "",
        last_name: profile.last_name || "",
        age: cleanNumber(profile.age),
        gender: profile.gender || null,
        phone_number: profile.phone_number || "",
        email: profile.email || "",
        address: profile.address || "",
        account_type: profile.account_type || "",
      }
    };

    return axiosInstance.put(`/agents/${id}/`, dataToSend);
  }
};

export default AgentService;
