import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Input, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../Header";
import { useState } from "react";
import ImageIcon from '@mui/icons-material/Image';

const EmployeeForm = ({ onSubmit, mode = "add", initialValues = {} }) => { 
  // Default to "add" mode and accept initial values for edit mode
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [selectedImage, setSelectedImage] = useState(
    initialValues.employee_pic ? initialValues.employee_pic : null
  );

  const handleFormSubmit = (values) => {
    onSubmit(values); // Pass the form values to the parent for processing
    if (mode === "add") {
      console.log("Employee added:", values);
    } else {
      console.log("Employee updated:", values);
    }
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFieldValue("employee_pic", file);
    }
  };

  return (
    <Box m="20px" maxWidth="800px" mx="auto">
      <Header
        title={mode === "add" ? "NEW EMPLOYEE" : "EDIT EMPLOYEE"}
        subtitle={
          mode === "add" 
            ? "Create a New Employee Profile" 
            : "Update the Employee Profile"
        }
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
          account_types: initialValues.account_types || "",
          hire_date: initialValues.hire_date || "",
          salary: initialValues.salary || "",
          employee_pic: initialValues.employee_pic || null,
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
              {/* Employee Picture Upload */}
              <Grid item xs={12} sm={3}>
                <Box
                  border="1px dashed grey"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  p={2}
                  sx={{ mb: 2 }}
                >
                  {selectedImage ? (
                    <Box mb={2}>
                      <img
                        src={selectedImage}
                        alt="Selected"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  ) : (
                    <ImageIcon sx={{ fontSize: 50, color: "grey.500" }} />
                  )}

                  <Typography variant="h6" color="textSecondary" mb={2}>
                    {selectedImage ? "Change Image" : "Upload Image"}
                  </Typography>

                  <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    sx={{ mb: 2 }}
                  >
                    {selectedImage ? "Change Image" : "Select Image"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(event) => handleImageChange(event, setFieldValue)}
                    />
                  </Button>

                  {selectedImage && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setSelectedImage(null);
                        setFieldValue("employee_pic", null);
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </Box>
              </Grid>

              {/* Stack Name Fields Vertically */}
              <Grid item xs={12} sm={9}>
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

              {/* Account Type and Hire Date Fields */}
              <Grid item xs={12} sm={6}>
                <FormControl variant="filled" fullWidth>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.account_types}
                    name="account_types"
                    error={touched.account_types && !!errors.account_types}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="cashier">Cashier</MenuItem>
                    <MenuItem value="information">Information</MenuItem>
                  </Select>
                  {touched.account_types && errors.account_types && (
                    <Box sx={{ color: "red", mt: 1 }}>{errors.account_types}</Box>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="filled"
                  type="date"
                  label="Hire Date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.hire_date}
                  name="hire_date"
                  error={touched.hire_date && !!errors.hire_date}
                  helperText={touched.hire_date && errors.hire_date}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }} // Vertical margin
                />
              </Grid>

              {/* Salary and Commission Amount Fields */}
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="filled"
                  type="number"
                  label="Salary"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.salary}
                  name="salary"
                  error={touched.salary && !!errors.salary}
                  helperText={touched.salary && errors.salary}
                  fullWidth
                  sx={{ mb: 2 }} // Vertical margin
                />
              </Grid>
              </Grid>

              <Box display="flex" justifyContent="center" mt={2}>
                <Button type="submit" color="secondary" variant="contained">
                  {mode === "add" ? "Create New Employee" : "Save Changes"}
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
  account_types: "",
  hire_date: "",
  salary: "",
  employee_pic: null,
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
  account_types: yup.string().required("Required"),
  hire_date: yup.string().required("Required"),
  salary: yup.number().required("Required"),
});

export default EmployeeForm;
