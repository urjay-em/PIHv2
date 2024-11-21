import axiosInstance from './axiosInstance';

const EmployeeService = {
  getAllEmployees: () => {
    return axiosInstance.get('employees/');
  },

  createEmployee: (employeeData) => {
    return axiosInstance.post('employees/', employeeData);
  },

  updateEmployee: (id, employeeData) => {
    return axiosInstance.put(`employees/${id}/`, employeeData);
  },

  deleteEmployee: (id) => {
    return axiosInstance.delete(`employees/${id}/`);
  }
};

export default EmployeeService;
