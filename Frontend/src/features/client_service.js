import axiosInstance from './axiosInstance';

const ClientService = {
  getAllClients: () => {
    return axiosInstance.get('/clients');
  },

  updateClient: (id, clientData) => {
    const cleanNumber = (value) => {
      return value === "" || value === undefined ? null : Number(value);
    };

    const dataToSend = {
      first_name: clientData.first_name || "",
      middle_name: clientData.middle_name || "",
      last_name: clientData.last_name || "",
      age: cleanNumber(clientData.age),
      gender: clientData.gender || null,
      phone_number: clientData.phone_number || "",
      email: clientData.email || "",
      address: clientData.address || "",
      account_type: clientData.account_type || "",
      occupation: clientData.occupation || "",
      date_registered: clientData.date_registered || null,
      last_updated: clientData.last_updated || null,
      agent: clientData.agent || null,
    };

    return axiosInstance.put(`/clients/${id}/`, dataToSend);
  },

  deleteClient: (id) => {
    return axiosInstance.delete(`/clients/${id}`);
  },

  createClient: (clientData) => {
    const cleanNumber = (value) => {
      return value === "" || value === undefined ? null : Number(value);
    };

    const dataToSend = {
      first_name: clientData.first_name || "",
      middle_name: clientData.middle_name || "",
      last_name: clientData.last_name || "",
      age: cleanNumber(clientData.age),
      gender: clientData.gender || null,
      phone_number: clientData.phone_number || "",
      email: clientData.email || "",
      address: clientData.address || "",
      account_type: clientData.account_type || "",
      occupation: clientData.occupation || "",
      date_registered: clientData.date_registered || null,
      last_updated: clientData.last_updated || null,
      agent: clientData.agent || null,
    };

    return axiosInstance.post('/clients', dataToSend);
  },
};

export default ClientService;
