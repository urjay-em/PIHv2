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
import Form from "../../pages/form/EmployeeForm.jsx";



const Client = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); 
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await EmployeeService.getAllEmployees();
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error("Failed to load employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setFormData({});
    setSelectedEmployee(null);
    setOpenDialog(true);
  };

  const handleEditEmployee = (employee) => {
    setFormData(employee);
    setSelectedEmployee(employee);
    setOpenDialog(true);
  };

  // Open the delete confirmation dialog
  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  // Delete employee on confirmation
  const handleDeleteEmployee = async () => {
    try {
      if (selectedEmployee) {
        await EmployeeService.deleteEmployee(selectedEmployee.id);
        fetchEmployees();
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  const handleSaveEmployee = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }

    try {
      if (selectedEmployee) {
        await EmployeeService.updateEmployee(selectedEmployee.id, formData);
      } else {
        await EmployeeService.createEmployee(formData);
      }
      fetchEmployees();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
    setFormData({});
  };
  

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = employees.filter((employee) =>
      Object.values(employee).some((field) =>
        field?.toString().toLowerCase().includes(value)
      )
    );
    setFilteredEmployees(filtered);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "middle_name", headerName: "Middle Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "age", headerName: "Age", width: 40 },
    { field: "gender", headerName: "Gender", width: 60 },
    { field: "contact_no", headerName: "Contact Number", flex: 1 },
    { field: "email_address", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "account_type", headerName: "Account Type", flex: 1 },
    { field: "hire_date", headerName: "Hire Date", width: 90 },
    { field: "salary", headerName: "Salary (₱)", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center" gap={1} height="100%">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            size="small"
            onClick={() => handleEditEmployee(params.row)}
            style={{ textTransform: "none" }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            size="small"
            onClick={() => handleDeleteClick(params.row)}
            style={{ textTransform: "none" }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="80px">
      <Header title="EMPLOYEES" subtitle="List of Employees in the Database" />
      <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddEmployee}>
          Add Employee
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearch}
          sx={{ width: { xs: "100%", sm: "300px" }, mt: { xs: 2, sm: 0 } }}
        />
      </Box>
      <Box sx={{ height: "calc(100vh - 250px)", width: "100%", overflowY: "auto", bgcolor: "background.default", borderRadius: "8px", boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)" }}>
        <DataGrid
          rows={filteredEmployees}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          loading={loading}
          disableSelectionOnClick
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this employee? This action cannot be undone.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteEmployee} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Employee Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedEmployee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
        <DialogContent>
          <Form
            mode={selectedEmployee ? "edit" : "add"}
            initialValues={selectedEmployee || {}}
            onSubmit={handleSaveEmployee}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Client;
