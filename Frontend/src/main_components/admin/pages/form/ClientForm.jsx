import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../Header";
import { useState, useEffect } from "react";
import ImageIcon from '@mui/icons-material/Image';

const ClientForm = ({ onSubmit, mode = "add", initialValues = {}, agents = [] }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [selectedImage, setSelectedImage] = useState(initialValues.profile_pic || null);

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFieldValue("profile_pic", file);
    }
  };

  return (
    <Box m="20px" maxWidth="800px" mx="auto">
      <Header
        title={mode === "add" ? "NEW CLIENT" : "EDIT CLIENT"}
        subtitle={mode === "add" ? "Create a New Client Profile" : "Update the Client Profile"}
      />

      <Formik
        onSubmit={onSubmit}
        initialValues={{
          first_name: initialValues.first_name || "",
          middle_name: initialValues.middle_name || "",
          last_name: initialValues.last_name || "",
          address: initialValues.address || "",
          age: initialValues.age || "",
          gender: initialValues.gender || "",
          email: initialValues.email || "",
          phone_number: initialValues.phone_number || "",
          profile_pic: initialValues.profile_pic || null,
          occupation: initialValues.occupation || "",
          account_type: initialValues.account_type || "client",
          agent: initialValues.agent || "",
        }}
        validationSchema={clientSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Profile Picture */}
              <Grid item xs={12} sm={3}>
                <Box
                  border="1px dashed grey"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  p={2}
                >
                  {selectedImage ? (
                    <Box mb={2}>
                      <img
                        src={selectedImage}
                        alt="Selected"
                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                      />
                    </Box>
                  ) : (
                    <ImageIcon sx={{ fontSize: 50, color: "grey.500" }} />
                  )}
                  <Typography variant="h6" color="textSecondary" mb={2}>
                    {selectedImage ? "Change Image" : "Upload Image"}
                  </Typography>

                  <Button variant="contained" component="label" color="primary">
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
                        setFieldValue("profile_pic", null);
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </Box>
              </Grid>

              {/* Name Fields */}
              <Grid item xs={12} sm={9}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <TextField
                      variant="filled"
                      label="First Name"
                      name="first_name"
                      value={values.first_name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={touched.first_name && !!errors.first_name}
                      helperText={touched.first_name && errors.first_name}
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      variant="filled"
                      label="Middle Name"
                      name="middle_name"
                      value={values.middle_name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={touched.middle_name && !!errors.middle_name}
                      helperText={touched.middle_name && errors.middle_name}
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      variant="filled"
                      label="Last Name"
                      name="last_name"
                      value={values.last_name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={touched.last_name && !!errors.last_name}
                      helperText={touched.last_name && errors.last_name}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  variant="filled"
                  label="Address"
                  name="address"
                  value={values.address}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.address && !!errors.address}
                  helperText={touched.address && errors.address}
                  fullWidth
                />
              </Grid>

              {/* Age & Gender */}
              <Grid item xs={6} sm={3}>
                <TextField
                  variant="filled"
                  label="Age"
                  name="age"
                  type="number"
                  value={values.age}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.age && !!errors.age}
                  helperText={touched.age && errors.age}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl variant="filled" fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={values.gender}
                    onBlur={handleBlur}
                    onChange={handleChange}
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

              {/* Email & Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="filled"
                  label="Email"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="filled"
                  label="Phone Number"
                  name="phone_number"
                  value={values.phone_number}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.phone_number && !!errors.phone_number}
                  helperText={touched.phone_number && errors.phone_number}
                  fullWidth
                />
              </Grid>

              {/* Occupation */}
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="filled"
                  label="Occupation"
                  name="occupation"
                  value={values.occupation}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.occupation && !!errors.occupation}
                  helperText={touched.occupation && errors.occupation}
                  fullWidth
                />
              </Grid>

              {/* Agent Selection */}
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="filled"
                  label="Agent"
                  name="agent"
                  value={values.agent}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Box display="flex" justifyContent="center" mt={3}>
              <Button type="submit" variant="contained" color="secondary">
                {mode === "add" ? "Create Client" : "Save Changes"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const clientSchema = yup.object().shape({
  first_name: yup.string().required("Required"),
  middle_name: yup.string(),
  last_name: yup.string().required("Required"),
  address: yup.string().required("Required"),
  age: yup.number().nullable().required("Required"),
  gender: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  phone_number: yup.string().required("Required"),
  occupation: yup.string().required("Required"),
  agent: yup.string().optional("Optional"),
});

export default ClientForm;
