import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

const CreatePaymentForm = ({ open, onClose, onSubmit, request }) => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    if (!amount || !method) return;
    const payload = {
      payment_request: request.id,
      client: request.client_id,
      plot: request.plot_id,
      payment_plan: request.payment_plan,
      amount,
      payment_method: method,
      remarks,
    };
    onSubmit(payload);
  };
  {/* const handleSubmit = async () => {
    await axiosInstance.post("/payments/", {
      payment_request: request.id,
      client: request.client_id,
      plot: request.plot_id,
      // any extra form data...s
    });
    onClose(); // Close dialog after submission
  };
  */}

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Finalize Payment</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" mb={2}>
          Client: {request?.client_id}, Plot: {request?.plot_id}, Plan: {request?.payment_plan}
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Payment Method</InputLabel>
          <Select value={method} onChange={(e) => setMethod(e.target.value)}>
            <MenuItem value="gcash">GCash</MenuItem>
            <MenuItem value="onsite">Onsite</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Remarks"
          multiline
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePaymentForm;
