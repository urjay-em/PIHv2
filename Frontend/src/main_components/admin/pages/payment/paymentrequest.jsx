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

  const handleApproveReject = (action, request) => {
    const updatedStatus = action === "approve" ? "approved" : "rejected";
    const payload = {
      status: updatedStatus,
      rejection_reason: updatedStatus === "rejected" ? rejectionReason : null,
    };

    axiosInstance
      .patch(`/payment-requests/${request.id}/`, payload)
      .then((res) => {
        setPaymentRequests((prev) =>
          prev.map((r) => (r.id === request.id ? res.data : r))
        );
        setFilteredRequests((prev) =>
          prev.map((r) => (r.id === request.id ? res.data : r))
        );
        handleDialogClose();
      })
      .catch(() => {
        setErrorMessage("Failed to update status. Please try again.");
      });
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
        if (request.status === "reserved") {
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
        <Box
            sx={{
                width: "78%",  // Makes it stretch to 75% width of its container
                height: "auto",
                maxHeight: "65px",  // Adjust the max height if needed
                overflowY: "auto",  // Enables vertical scrolling if needed
                padding: 2,
                backgroundColor: "rgba(0, 0, 0, 0.1)", // Darker transparent background
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "14px",
                lineHeight: 1.6,
                mt: { xs: 2, sm: 0 },
            }}
            >
              <Typography variant="h2" gutterBottom><span dangerouslySetInnerHTML={{ __html: textContent }} /></Typography>
            
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <Box>
                <Typography><strong>Stone (₱50,000):</strong></Typography>
                <ul>
                    <li>12 months: ₱6,667 downpayment</li>
                    <li>24 months: ₱13,333 downpayment</li>
                    <li>36 months: ₱20,000 downpayment</li>
                    <li>Full: ₱50,000 upfront</li>
                </ul>
                </Box>

                <Box>
                <Typography><strong>Lawn (₱35,000):</strong></Typography>
                <ul>
                    <li>12 months: ₱4,861 downpayment</li>
                    <li>24 months: ₱9,722 downpayment</li>
                    <li>36 months: ₱14,583 downpayment</li>
                    <li>Full: ₱35,000 upfront</li>
                </ul>
                </Box>

                <Box>
                <Typography><strong>Valor (₱75,000):</strong></Typography>
                <ul>
                    <li>12 months: ₱10,000 downpayment</li>
                    <li>24 months: ₱20,000 downpayment</li>
                    <li>36 months: ₱30,000 downpayment</li>
                    <li>Full: ₱75,000 upfront</li>
                </ul>
                </Box>

                <Box>
                <Typography><strong>Mausoleum (₱150,000):</strong></Typography>
                <ul>
                    <li>12 months: ₱20,000 downpayment</li>
                    <li>24 months: ₱40,000 downpayment</li>
                    <li>36 months: ₱60,000 downpayment</li>
                    <li>Full: ₱150,000 upfront</li>
                </ul>
                </Box>
            </Box>
        </Box>
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
              <Typography variant="body1" mb={2}>
                Are you sure you want to change the status of this request?
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
          </Box>
        </DialogActions>
      </Dialog>

      {errorMessage && <Box mt={2} color="error.main">{errorMessage}</Box>}
    </Box>
  );
};

export default PaymentRequest;
