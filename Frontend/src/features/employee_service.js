import axiosInstance from './axiosInstance';

const EmployeeService = {
  getAllEmployees: () => axiosInstance.get('/employees/'), 
  getEmployeeById: (id) => axiosInstance.get(`/employees/${id}/`), 
  createEmployee: (employeeData) => axiosInstance.post('/employees/', employeeData), 
  deleteEmployee: (id) => axiosInstance.delete(`/employees/${id}/`), 
  
  updateEmployee: (id, employeeData) => {
    const profile = employeeData.profile || {};
  
    const cleanNumber = (value) => {
      return value === "" || value === undefined ? null : Number(value);
    };
  
    const dataToSend = {
      salary: cleanNumber(employeeData.salary),
      hire_date: employeeData.hire_date,
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
  
    return axiosInstance.put(`/employees/${id}/`, dataToSend);
  }
};  
export default EmployeeService;
