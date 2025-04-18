import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../features/axiosInstance";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Header from "../../Header";

const textContent = "Payment Plan Guide....................................Scroll me! (>_<)";
// Styled components for button colors
const ApproveButton = ({ disabled, onClick }) => (
  <Button
    onClick={onClick}
    color="success"
    variant="contained"
    sx={{
      width: "100px",
      backgroundColor: disabled ? "green" : "green",
      '&:hover': { backgroundColor: disabled ? 'green' : '#388e3c' }
    }}
    disabled={disabled}
  >
    Approve
  </Button>
);

const RejectButton = ({ disabled, onClick }) => (
  <Button
    onClick={onClick}
    color="error"
    variant="contained"
    sx={{
      width: "100px",
      backgroundColor: disabled ? "red" : "red",
      '&:hover': { backgroundColor: disabled ? 'red' : '#d32f2f' }
    }}
    disabled={disabled}
  >
    Reject
  </Button>
);

const UpdateButton = ({ disabled, onClick }) => (
  <Button
    onClick={onClick}
    color="primary"
    variant="contained"
    sx={{
      width: "100px",
      backgroundColor: "#1976d2",
      "&:hover": { backgroundColor: "#1565c0" },
      opacity: disabled ? 0.6 : 1,
      boxShadow: !disabled ? "0 0 10px 5px rgba(0, 123, 255, 0.5)" : "none", // Glow effect
    }}
    disabled={disabled}
  >
    Update
  </Button>
);

const PaymentRequest = () => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchPaymentRequests();
  }, []);

  const fetchPaymentRequests = async () => {
    try {
      const res = await axiosInstance.get("/payment-requests/");
      setPaymentRequests(res.data);
      setFilteredRequests(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setRejectionReason("");
    setSelectedRequest(null);
  };

  const handleApproveReject = async (action, request) => {
    const updatedStatus = action === "approve" ? "approved" : "rejected";
    const payload = {
      status: updatedStatus,
      rejection_reason: updatedStatus === "rejected" ? rejectionReason : null,
    };
  
    try {
      // Step 1: Update payment request status
      const res = await axiosInstance.patch(`/payment-requests/${request.id}/`, payload);
  
      // Step 2: If approved, create a payment entry
      if (updatedStatus === "approved") {
        const { amount, payment_method } = request;
  
        if (!amount || !payment_method) {
          setErrorMessage("Amount and Payment Method are required.");
          return;
        }
  
        // Step 2.1: Create payment entry
        await axiosInstance.post("/payments/", {
          payment_request: request.id,
          client: request.client_id,
          plot: request.plot_id,
          amount,
          payment_method,
          remarks: request.remarks || "",
        });
  
        // Step 2.2: Update plot status to 'sold'
        await axiosInstance.patch(`/plots/${request.plot_id}/`, {
          status: "sold",
        });
  
        // Step 3: Create balance tracker
        await axiosInstance.post("/balance-trackers/", {
          paymentrequest: request.id,
          client: request.client_id,
          plot: request.plot_id,
          total_price: request.price,
          total_paid: amount,
          last_amount_paid: amount,
          payments_made: 1,
          remaining_balance: request.price - amount,
          payment_plan: request.payment_plan,
        });
  
        alert("Balance Tracker has been successfully created.");
      }
  
      // Step 4: Update UI
      setPaymentRequests((prev) =>
        prev.map((r) => (r.id === request.id ? res.data : r))
      );
      setFilteredRequests((prev) =>
        prev.map((r) => (r.id === request.id ? res.data : r))
      );
      handleDialogClose();
  
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to approve request. Please try again.");
    }
  };
  
  const handleUpdatePayment = async (request) => {
    const { id, client_id, plot_id, amount, payment_method, remarks } = request;
  
    if (!amount || !payment_method) {
      setErrorMessage("Amount and Payment Method are required for updates.");
      return;
    }
  
    try {
      await axiosInstance.post("/payments/", {
        payment_request: id,
        client: client_id,
        plot: plot_id,
        amount,
        payment_method,
        remarks: remarks || "",
      });

      setErrorMessage(""); // Clear error
      handleDialogClose(); // Close the dialog
    } catch (err) {
      console.error("Failed to create updated payment:", err);
      setErrorMessage("Failed to update payment. Please try again.");
    }
  };
  

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = paymentRequests.filter((request) =>
      Object.values(request).some((field) =>
        field?.toString().toLowerCase().includes(value)
      )
    );
    setFilteredRequests(filtered);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "client_id", headerName: "Client ID", flex: 1 },
    { field: "plot_id", headerName: "Plot ID", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "rejection_reason", headerName: "Rejection Reason", flex: 1 },
    { field: "created_at", headerName: "Created At", flex: 1 },
    { field: "updated_at", headerName: "Updated At", flex: 1 },
    { field: "created_by", headerName: "Created By", flex: 1 },
    { field: "payment_plan", headerName: "Payment Plan", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 160,
      getActions: (params) => {
        const request = params.row;
        if (["reserved", "approved"].includes(request.status)) {
          return [
            <GridActionsCellItem
              label="Change Status"
              showInMenu
              onClick={() => {
                setSelectedRequest(request);
                setOpenDialog(true);
              }}
            />,
          ];
        }
        return [];
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="PAYMENT REQUESTS" subtitle="Manage plot payment requests" />

      <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={2}>
        <TextField
          variant="outlined"
          placeholder="Search..."
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
          rows={filteredRequests}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
        />
      </Box>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Approve or Reject Payment Request</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <>
              {/* READ-ONLY FIELDS */}
              <TextField
                label="Request ID"
                value={selectedRequest.id}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Client ID"
                value={selectedRequest.client_id}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Plot ID"
                value={selectedRequest.plot_id}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Price"
                value={selectedRequest.price}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Payment Plan"
                value={selectedRequest.payment_plan}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />

              {/* EDITABLE FIELDS */}
              <TextField
                label="Amount Paying"
                type="number"
                fullWidth
                margin="normal"
                value={selectedRequest.amount || ""}
                onChange={(e) =>
                  setSelectedRequest({ ...selectedRequest, amount: e.target.value })
                }
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="payment-method-label">Payment Method</InputLabel>
                <Select
                  labelId="payment-method-label"
                  value={selectedRequest.payment_method || ""}
                  onChange={(e) =>
                    setSelectedRequest({ ...selectedRequest, payment_method: e.target.value })
                  }
                >
                  <MenuItem value="gcash">GCash</MenuItem>
                  <MenuItem value="onsite">Onsite</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Remarks"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                value={selectedRequest.remarks || ""}
                onChange={(e) =>
                  setSelectedRequest({ ...selectedRequest, remarks: e.target.value })
                }
              />

              {/* REJECTION REASON DROPDOWN */}
              <Typography
                variant="subtitle1"
                sx={{
                  color: "error.main",
                  fontWeight: "bold",
                  textAlign: "center",
                  mt: 4,
                  mb: 1,
                  borderBottom: "1px solid",
                  borderColor: "error.main",
                  pb: 1,
                }}
              >
                ---------- Reject Request ----------
              </Typography>

              <FormControl fullWidth margin="normal">
                <InputLabel id="rejection-reason-label">Rejection Reason</InputLabel>
                <Select
                  labelId="rejection-reason-label"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  disabled={selectedRequest.status === "approved"}
                >
                  <MenuItem value="money_not_matching">Money Not Matching</MenuItem>
                  <MenuItem value="expired_request">Expired Request</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-around",
            padding: "16px 24px",
          }}
        >
          <Button onClick={handleDialogClose} variant="outlined" sx={{ width: "100px" }}>
            Cancel
          </Button>
          <Box display="flex" gap={2}>
            <ApproveButton
              onClick={() => handleApproveReject("approve", selectedRequest)}
              disabled={selectedRequest?.status === "approved"}
            />
            <RejectButton
              onClick={() => handleApproveReject("reject", selectedRequest)}
              disabled={!rejectionReason || selectedRequest?.status === "rejected"}
            />
            <UpdateButton
              onClick={() => handleUpdatePayment(selectedRequest)}
              disabled={selectedRequest?.status !== "approved"}
            />

          </Box>
        </DialogActions>
      </Dialog>

      {errorMessage && <Box mt={2} color="error.main">{errorMessage}</Box>}
    </Box>
  );
};

export default PaymentRequest;
