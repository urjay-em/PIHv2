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
import ClientService from "../../../../features/client_service.js";
import Header from "../../Header";
import Form from "../../pages/form/ClientForm.jsx"; 

const Clients = () => {
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
      const response = await ClientService.getAllClients();
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      console.error("Failed to load client data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = () => {
    setFormData({});
    setSelectedClient(null);
    setOpenDialog(true);
  };

  const handleEditClient = (client) => {
    setFormData(client);
    setSelectedClient(client);
    setOpenDialog(true);
  };

  const handleDeleteClick = (client) => {
    setSelectedClient(client);
    setDeleteDialogOpen(true);
  };

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
    try {
      if (selectedClient) {
        await ClientService.updateClient(selectedClient.id, data); // Send the plain data object
      } else {
        await ClientService.createClient(data); // Same for creating a new client
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
    { field: "age", headerName: "Age", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone_number", headerName: "Contact Number", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "account_type", headerName: "Account Type", flex: 1 },
    { field: "occupation", headerName: "Occupation", flex: 1 },
    { field: "date_registered", headerName: "Date Registered", flex: 1 },
    { field: "last_updated", headerName: "Last Updated", flex: 1 },
    { field: "agent", headerName: "Agent ID", flex: 1 },
  
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: "100%", height: "100%" }} >
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            size="small"
            onClick={() => handleEditClient(params.row)}
          >
            Edit
          </Button>
          {/* Add Delete Button if needed */}
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="CLIENTS" subtitle="List of Clients in the Database" />
      <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={2}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearch}
          sx={{ width: { xs: "100%", sm: "300px" }, mt: { xs: 2, sm: 0 } }}
        />
      </Box>
      <Box
        sx={{
          height: "calc(100vh - 250px)",
          width: "100%",
          overflowY: "auto",
          bgcolor: "background.default",
          borderRadius: "8px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <DataGrid
          rows={filteredClients}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          loading={loading}
          disableSelectionOnClick
        />
      </Box>

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
};

export default Clients;
