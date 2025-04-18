import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../Header";  // Ensure this path is correct
import axiosInstance from "../../../../features/axiosInstance"; // Ensure this path is correct

const Balances = () => {
  const [balances, setBalances] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredBalances, setFilteredBalances] = useState([]);

  useEffect(() => {
    // Fetch balance data from the backend
    const fetchBalances = async () => {
      try {
        const response = await axiosInstance.get("/balance-trackers/");
        setBalances(response.data);
        setFilteredBalances(response.data);
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = balances.filter((balance) =>
      Object.values(balance).some((field) =>
        field?.toString().toLowerCase().includes(value)
      )
    );
    setFilteredBalances(filtered);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "client", headerName: "Client", flex: 1 },
    { field: "plot", headerName: "Plot", flex: 1 },
    { field: "total_paid", headerName: "Total Paid (₱)", flex: 1 },
    { field: "remaining_balance", headerName: "Remaining Balance (₱)", flex: 1 },
    { field: "payments_made", headerName: "Payments Made", flex: 1 },
    { field: "last_amount_paid", headerName: "Last Amount Paid (₱)", flex: 1 },
    { field: "payment_plan", headerName: "Payment Plan", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="BALANCE TRACKERS" subtitle="Record of all balance trackers" />

      <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={2}>
        <TextField
          variant="outlined"
          placeholder="Search balances..."
          value={searchText}
          onChange={handleSearch}
          sx={{ width: { xs: "100%", sm: "250px" }, mt: { xs: 2, sm: 1 } }}
        />
      </Box>

      <Box
        sx={{
          height: "calc(98vh - 250px)",
          width: "100%",
          overflowY: "auto",
          bgcolor: "background.default",
          borderRadius: "8px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <DataGrid
          rows={filteredBalances}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Balances;
