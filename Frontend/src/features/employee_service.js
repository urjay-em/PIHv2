import axiosInstance from './axiosInstance';

const EmployeeService = {
  getAllEmployees: () => axiosInstance.get('/employees/'), 
  getEmployeeById: (id) => axiosInstance.get(`/employees/${id}/`), 
  createEmployee: (employeeData) => axiosInstance.post('/employees/', employeeData), 
  updateEmployee: (id, employeeData) => axiosInstance.put(`/employees/${id}/`, employeeData), 
  deleteEmployee: (id) => axiosInstance.delete(`/employees/${id}/`), 
};

export default EmployeeService;