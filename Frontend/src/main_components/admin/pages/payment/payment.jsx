import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../Header";
import axiosInstance from "../../../../features/axiosInstance"; // Ensure this path is correct

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);

  useEffect(() => {
    // Fetch payments from the backend
    const fetchPayments = async () => {
      try {
        const response = await axiosInstance.get("/payments/");
        setPayments(response.data);
        setFilteredPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = payments.filter((payment) =>
      Object.values(payment).some((field) =>
        field?.toString().toLowerCase().includes(value)
      )
    );
    setFilteredPayments(filtered);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "client", headerName: "Client", flex: 1 },
    { field: "plot", headerName: "Plot", flex: 1 },
    { field: "amount", headerName: "Amount (₱)", flex: 1 },
    { field: "payment_method", headerName: "Payment Method", flex: 1 },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    { field: "created_by", headerName: "Created By", flex: 1 },
    { field: "created_at", headerName: "Date Paid", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="PAYMENT HISTORY" subtitle="Record of all processed payments" />

      <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={2}>
        <TextField
          variant="outlined"
          placeholder="Search payments..."
          value={searchText}
          onChange={handleSearch}
          sx={{ width: { xs: "100%", sm: "250px" }, mt: { xs: 2, sm: 1 } }}
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
          rows={filteredPayments}
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

export default Payment;
