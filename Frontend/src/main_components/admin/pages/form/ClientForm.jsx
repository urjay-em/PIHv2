import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Input, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../Header";
import { useState } from "react";

const ClientForm = ({ onSubmit, mode = "add", initialValues = {} }) => { 
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    onSubmit(values); // Pass the form values to the parent for processing
    if (mode === "add") {
      console.log("Client added:", values);
    } else {
      console.log("Client updated:", values);
    }
  };

  return (
    <Box m="20px" maxWidth="800px" mx="auto">
      <Header
        title={mode === "add" ? "NEW CLIENT" : "EDIT CLIENT"}
        subtitle={mode === "add" 
          ? "Create a New Client Profile" 
          : "Update the Client Profile"}
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          first_name: initialValues.first_name || "",
          middle_name: initialValues.middle_name || "",
          last_name: initialValues.last_name || "",
          address: initialValues.address || "",
          age: initialValues.age || "",
          gender: initialValues.gender || "",
          email_address: initialValues.email_address || "",
          contact_no: initialValues.contact_no || "",
          plot_details: initialValues.plot_details || "",
          payment_status: initialValues.payment_status || "",
          payment_method: initialValues.payment_method || "",
        }}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Client Name Fields */}
              <Grid item xs={12} sm={6} md={12}>
                <Grid container direction="column" spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="filled"
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.first_name}
                      name="first_name"
                      error={touched.first_name && !!errors.first_name}
                      helperText={touched.first_name && errors.first_name}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="filled"
                      label="Middle Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.middle_name}
                      name="middle_name"
                      error={touched.middle_name && !!errors.middle_name}
                      helperText={touched.middle_name && errors.middle_name}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="filled"
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.last_name}
                      name="last_name"
                      error={touched.last_name && !!errors.last_name}
                      helperText={touched.last_name && errors.last_name}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Address Field */}
              <Grid item xs={12} sm={8}>
                <TextField
                  variant="filled"
                  label="Address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  name="address"
                  error={touched.address && !!errors.address}
                  helperText={touched.address && errors.address}
                  fullWidth
                  sx={{ mb: 2 }} // Vertical margin
                />
              </Grid>

              {/* Age and Gender Fields */}
              <Grid item xs={12} sm={2}>
                <TextField
                  variant="filled"
                  type="number"
                  label="Age"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.age}
                  name="age"
                  error={touched.age && !!errors.age}
                  helperText={touched.age && errors.age}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl variant="filled" fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.gender}
                    name="gender"
                    error={touched.gender && !!errors.gender}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                  </Select>
                  {touched.gender && errors.gender && (
                    <Box sx={{ color: "red", mt: 1 }}>{errors.gender}</Box>
                  )}
                </FormControl>
              </Grid>

              {/* Email and Contact Number Fields */}
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="filled"
                  label="Email Address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email_address}
                  name="email_address"
                  error={touched.email_address && !!errors.email_address}
                  helperText={touched.email_address && errors.email_address}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="filled"
                  label="Contact Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.contact_no}
                  name="contact_no"
                  error={touched.contact_no && !!errors.contact_no}
                  helperText={touched.contact_no && errors.contact_no}
                  fullWidth
                  sx={{ mb: 2 }} // Vertical margin
                />
              </Grid>

              {/* Plot Details and Payment Fields */}
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="filled"
                  label="Plot Details"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.plot_details}
                  name="plot_details"
                  error={touched.plot_details && !!errors.plot_details}
                  helperText={touched.plot_details && errors.plot_details}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="filled" fullWidth>
                  <InputLabel>Payment Status</InputLabel>
                  <Select
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.payment_status}
                    name="payment_status"
                    error={touched.payment_status && !!errors.payment_status}
                  >
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                  {touched.payment_status && errors.payment_status && (
                    <Box sx={{ color: "red", mt: 1 }}>{errors.payment_status}</Box>
                  )}
                </FormControl>
              </Grid>

              {/* Payment Method Field */}
              <Grid item xs={12} sm={6}>
                <FormControl variant="filled" fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.payment_method}
                    name="payment_method"
                    error={touched.payment_method && !!errors.payment_method}
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="installment">Credit</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  </Select>
                  {touched.payment_method && errors.payment_method && (
                    <Box sx={{ color: "red", mt: 1 }}>{errors.payment_method}</Box>
                  )}
                </FormControl>
              </Grid>

            </Grid>

            <Box display="flex" justifyContent="center" mt={2}>
              <Button type="submit" color="secondary" variant="contained">
                {mode === "add" ? "Create New Client" : "Save Changes"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Initial form values
const initialValues = {
  first_name: "",
  middle_name: "",
  last_name: "",
  address: "",
  age: "",
  gender: "",
  email_address: "",
  contact_no: "",
  plot_details: "",
  payment_status: "pending",
  payment_method: "cash",
};

// Validation schema using yup
const checkoutSchema = yup.object().shape({
  first_name: yup.string().required("Required"),
  middle_name: yup.string().required("Required"),
  last_name: yup.string().required("Required"),
  address: yup.string().required("Required"),
  age: yup.number().required("Required"),
  gender: yup.string().required("Required"),
  email_address: yup.string().email("Invalid email").required("Required"),
  contact_no: yup.string().required("Required"),
  plot_details: yup.string().required("Required"),
  payment_status: yup.string().required("Required"),
  payment_method: yup.string().required("Required"),
});

export default ClientForm;
