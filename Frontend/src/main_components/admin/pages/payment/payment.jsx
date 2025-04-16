import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://127.0.0.1:8000/api/v1/payments/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleStatusChange = (paymentId, newStatus) => {
    axios.patch(
      `http://127.0.0.1:8000/api/v1/payments/${paymentId}/`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    )
    .then(() => fetchPayments())
    .catch((err) => console.error("Error updating status:", err));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    return (
      (statusFilter === "all" || payment.status === statusFilter) &&
      (payment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       payment.agent_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        Payment Declarations
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Search by Agent or Client"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="confirmed">Confirmed</MenuItem>
          <MenuItem value="voided">Voided</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Plot</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Declared Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.client_name}</TableCell>
                <TableCell>{row.agent_name}</TableCell>
                <TableCell>{row.plot_name}</TableCell>
                <TableCell>₱{row.amount}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.declared_date}</TableCell>
                <TableCell align="center">
                  {row.status === "pending" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusChange(row.id, "confirmed")}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleStatusChange(row.id, "voided")}
                        size="small"
                      >
                        Void
                      </Button>
                    </>
                  )}
                  {row.status !== "pending" && (
                    <Typography variant="body2" color="textSecondary">
                      No actions
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredPayments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Payment;
