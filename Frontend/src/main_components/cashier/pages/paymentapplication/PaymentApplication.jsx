import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Payment Data:", formData);
    alert("Payment submitted! (No backend logic yet)");
  };

  return (
    <Box>
      <Card
        sx={{
          maxWidth: 500,
          margin: "auto",
          mt: 5,
          boxShadow: 3,
          padding: 3,
          borderRadius: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            mb={3}
            textAlign="center"
            sx={{ color: "#2c3e50" }} 
          >
            Payment Application
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name on Card"
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#2c3e50" } }} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  variant="outlined"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                  placeholder="1234 5678 9012 3456"
                  inputProps={{ maxLength: 19 }}
                  InputLabelProps={{ style: { color: "#2c3e50" } }} 
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  variant="outlined"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                  placeholder="MM/YY"
                  inputProps={{ maxLength: 5 }}
                  InputLabelProps={{ style: { color: "#2c3e50" } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVC"
                  variant="outlined"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleChange}
                  required
                  placeholder="123"
                  inputProps={{ maxLength: 3 }}
                  InputLabelProps={{ style: { color: "#2c3e50" } }} 
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#6c5ce7",
                    "&:hover": { backgroundColor: "#341f97" },
                    color: "white",
                  }}
                >
                  Pay Now
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

const PaymentApplication = () => {
  return (
    <Box m="20px" sx={{ backgroundColor: "#ecf0f1", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#2c3e50",
          textAlign: "center",
          padding: "20px 0",
        }}
      >
        PAYMENT APPLICATION
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          color: "#7f8c8d",
          textAlign: "center",
        }}
      >
        List of Payment Application
      </Typography>
      <PaymentForm />
    </Box>
  );
};

export default PaymentApplication;
