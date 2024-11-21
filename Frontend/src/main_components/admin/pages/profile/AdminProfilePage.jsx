import { Box, Button, TextField, Snackbar, Alert, Grid, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../Header";
import { useState, useEffect } from "react";
import ImageIcon from "@mui/icons-material/Image";

const AdminProfilePage = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [profile, setProfile] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    address: "",
    email_address: "",
    contacts: "",
    employee_pic: "",
  });

  const [profilePicture, setProfilePicture] = useState(localStorage.getItem("profilePicture") || null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchedProfile = {
      first_name: localStorage.getItem("first_name") || "",
      middle_name: localStorage.getItem("middle_name") || "",
      last_name: localStorage.getItem("last_name") || "",
      address: "",
      email_address: "",
      contacts: "",
    };
    setProfile(fetchedProfile);
  }, []);

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setProfilePicture(imageUrl);
        setFieldValue("employee_pic", imageUrl); // Update Formik's employee_pic field
        localStorage.setItem("profilePicture", imageUrl); // Save to localStorage
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);

    // Simulate an API call
    setTimeout(() => {
      console.log("Profile saved:", values); // Log profile for debugging
      setIsLoading(false);

      // Show Snackbar after saving
      setOpenSnackbar(true);

      // Optionally reset the form if needed
      resetForm();
    }, 2000);
  };

  return (
    <Box m="20px" maxWidth="800px" mx="auto">
      <Header title="PROFILE INFORMATION" subtitle="Edit Profile Information" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={profile}
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
                  {profilePicture ? (
                    <Box mb={2}>
                      <img
                        src={profilePicture}
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
                    {profilePicture ? "Change Image" : "Upload Image"}
                  </Typography>

                  <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    sx={{ mb: 2 }}
                  >
                    {profilePicture ? "Change Image" : "Select Image"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                    />
                  </Button>

                  {profilePicture && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setProfilePicture(null);
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
              <Grid item xs={12}>
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
                />
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
                  value={values.contacts}
                  name="contacts"
                  error={touched.contacts && !!errors.contacts}
                  helperText={touched.contacts && errors.contacts}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* Snackbar for success confirmation */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Validation schema using yup
const checkoutSchema = yup.object().shape({
  first_name: yup.string().required("Required"),
  middle_name: yup.string().required("Required"),
  last_name: yup.string().required("Required"),
  address: yup.string().required("Required"),
  email_address: yup.string().email("Invalid email").required("Required"),
  contacts: yup.string().required("Required"),
  employee_pic: yup.mixed().required("Image is required"),
});

export default AdminProfilePage;
