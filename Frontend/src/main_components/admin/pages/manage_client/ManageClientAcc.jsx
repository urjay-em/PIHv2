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
import EmployeeService from "../../../../features/client_service.js";
import Header from "../../Header.jsx";
import Form from "../form/ClientForm.jsx";

const ManageClientAcc = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); 
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await EmployeeService.getAllClients();
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      console.error("Failed to load Client data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = () => {
    setFormData({});
    setSelectedClient(null);
    setOpenDialog(true);
  };

  const handleclient = (client) => {
    setFormData(client);
    setSelectedClient(client);
    setOpenDialog(true);
  };

  // Open the delete confirmation dialog
  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setDeleteDialogOpen(true);
  };

  // Delete employee on confirmation
  const handleDeleteClient = async () => {
    try {
      if (selectedClient) {
        await ClientService.deleteClient(selectedClient.id);
        fetchClients();
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  const handleSaveClient = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }

    try {
      if (selectedClient) {
        await ClientService.updateEmployee(selectedClient.id, formData);
      } else {
        await ClientService.createClient(formData);
      }
      fetchClients();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClient(null);
    setFormData({});
  };
  

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = clients.filter((client) =>
      Object.values(client).some((field) =>
        field?.toString().toLowerCase().includes(value)
      )
    );
    setFilteredClients(filtered);
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
    { field: "date_registered", headerName: "Date Registered", width: 90 },
    { field: "mode_of_payment", headerName: "Mode of Payment", flex: 1 },
    { field: "balance_to_pay", headerName: "Balance to Pay", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "agent_id", headerName: "Agent ID", flex: 1 },
    { field: "plot_id", headerName: "Plot ID", flex: 1 },
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
    <Box m="20px">
      <Header title="CLIENTS" subtitle="List of Clients in the Database" />
      <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddClient}>
          Add Client
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
          rows={filteredClients}
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
          <p>Are you sure you want to delete this client? This action cannot be undone.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteClient} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Employee Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedClient ? "Edit Client" : "Add New Client"}</DialogTitle>
        <DialogContent>
          <Form
            mode={selectedClient ? "edit" : "add"}
            initialValues={selectedClient || {}}
            onSubmit={handleSaveClient}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
    
}

export default ManageClientAcc;