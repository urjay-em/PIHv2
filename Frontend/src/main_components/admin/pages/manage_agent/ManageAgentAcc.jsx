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
import AgentService from "../../../../features/agent_service.js";
import Header from "../../Header";
import Form from "../../pages/form/AgentForm.jsx";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const response = await AgentService.getAllAgents();
      setAgents(response.data);
      setFilteredAgents(response.data);
    } catch (error) {
      console.error("Failed to load agent data:", error); 
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgent = () => {
    setFormData({});
    setSelectedAgent(null);
    setOpenDialog(true);
  };

  const handleEditAgent = (agent) => { 
    setFormData(agent);
    setSelectedAgent(agent);
    setOpenDialog(true);
  };

  //delete confirmation dialog
  const handleDeleteClick = (agent) => {  
    setSelectedAgent(agent); 
    setDeleteDialogOpen(true);
  };

  //delete confirmation
  const handleDeleteAgent = async () => {
    try {
      if (selectedAgent) {
        await AgentService.deleteAgent(selectedAgent.id);
        fetchAgents();
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete agent:", error);
    }
  };

  const handleSaveAgent = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }

    try {
      if (selectedAgent) {
        await AgentService.updateAgent(selectedAgent.id, formData); 
      } else {
        await AgentService.createAgent(formData);
      }
      fetchAgents();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving agent:", error); 
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAgent(null);
    setFormData({});
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = agents.filter((agent) =>
      Object.values(agent).some((field) =>
        field?.toString().toLowerCase().includes(value)
      )
    );
    setFilteredAgents(filtered);
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
    { field: "commision_rate", headerName: "Commision Rate (₱)", flex: 1 },
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
            onClick={() => handleEditAgent(params.row)}
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
      <Header title="AGENTS" subtitle="List of Agents in the Database" />  {/*AGENTS*/}
      <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddAgent}>
          Add Agent  {/*Agent*/}
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
          rows={filteredAgents}
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
          <p>Are you sure you want to delete this agent? This action cannot be undone.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAgent} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Agent Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedAgent ? "Edit Agent" : "Add New Agent"}</DialogTitle>  {/*Agent*/}
        <DialogContent>
          <Form
            mode={selectedAgent ? "edit" : "add"}
            initialValues={selectedAgent || {}}
            onSubmit={handleSaveAgent}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Agents;
