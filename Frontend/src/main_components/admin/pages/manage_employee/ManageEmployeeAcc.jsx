import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import EmployeeService from "../../../../features/employee_service.js";
import Header from "../../Header";
import EmployeeForm from "../../pages/form/EmployeeForm.jsx";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await EmployeeService.getAllEmployees();
      console.log("Fetched Employees:", response.data); // Log the full response
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to load employee data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setOpenDialog(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setOpenDialog(true);
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    try {
      await EmployeeService.deleteEmployee(selectedEmployee.id);
      fetchEmployees();
    } catch (error) {
      console.error("Failed to delete employee:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleSaveEmployee = async (formData) => {
    const mappedData = {
      salary: formData.salary,
      hire_date: formData.hire_date,
      profile: {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        account_type: formData.account_type, // account_types -> account_type
        age: formData.age,
        gender: formData.gender,
        phone_number: formData.contact_no, // contact_no -> phone_number
        email: formData.email_address, // email_address -> email
        address: formData.address,
        employee_pic: formData.employee_pic,
      },
    };
  
    try {
      if (selectedEmployee) {
        await EmployeeService.updateEmployee(selectedEmployee.id, mappedData);
      } else {
        await EmployeeService.createEmployee(mappedData);
      }
      fetchEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
    } finally {
      setOpenDialog(false);
      setSelectedEmployee(null);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredEmployees = employees.filter((employee) =>
    Object.values(employee).some((field) =>
      field?.toString().toLowerCase().includes(searchText)
    )
  );

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "middle_name", headerName: "Middle Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "age", headerName: "Age", width: 60 },
    { field: "gender", headerName: "Gender", width: 80 },
    { field: "phone_number", headerName: "Contact Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "account_type", headerName: "Account Type", flex: 1 },
    { field: "hire_date", headerName: "Hire Date", width: 120 },
    { field: "salary", headerName: "Salary (₱)", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      renderCell: (params) => (
        <Box display="flex"
          justifyContent="center" // Center horizontally
          alignItems="center" // Center vertically
          sx={{ width: "100%", height: "100%" }} // Ensure the full height is used
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            size="small"
            onClick={() => handleEditEmployee(params.row)}
          >
            Edit
          </Button>
          {/* 
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            size="small"
            onClick={() => handleDeleteClick(params.row)}
          >
            Delete
          </Button>
          */}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="EMPLOYEES" subtitle="List of Employees in the Database" />
      <Box display="flex" justifyContent="space-between" mb={2}>
        {/* 
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddEmployee}>
          Add Employee
        </Button>
        */}
        <TextField variant="outlined" placeholder="Search..." value={searchText} onChange={handleSearch} />
      </Box>
      <Box sx={{ height: "65vh", width: "100%" }}>
      <DataGrid 
        rows={filteredEmployees} 
        columns={columns} 
        pageSize={10} 
        loading={loading} 
        getRowId={(row) => row.id} // Ensure DataGrid knows how to get the row ID
      />
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this employee?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteEmployee} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Employee Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{selectedEmployee ? "Edit Employee" : "Add Employee"}</DialogTitle>
        <DialogContent>
          <EmployeeForm mode={selectedEmployee ? "edit" : "add"} initialValues={selectedEmployee || {}} onSubmit={handleSaveEmployee} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Employees;
