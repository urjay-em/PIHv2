import { Box, Button, TextField, Snackbar, Alert, Grid, Typography, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../Header";
import { useState, useEffect } from "react";
import ImageIcon from "@mui/icons-material/Image";
import InputMask from "react-input-mask";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1/profile/"; // Adjust this based on your backend

const AdminProfilePage = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [profile, setProfile] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    address: "",
    email: "",
    phone_number: "+63 ",
    age: "",
    gender: "",
    account_type: "client",
    date_registered: "",
    profile_pic: null, // Store only the file reference
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch profile data from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_BASE_URL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile({
            first_name: data.first_name || "",
            middle_name: data.middle_name || "",
            last_name: data.last_name || "",
            address: data.address || "",
            email: data.email || "",
            phone_number: data.phone_number || "+63 ",
            age: data.age || "",
            gender: data.gender || "",
            account_type: data.account_type || "client",
            date_registered: data.date_registered || "",
            profile_pic: data.profile_pic || null,
          });

          if (data.profile_pic) {
            setProfilePicture(data.profile_pic); // ✅ Directly use the API URL
          }
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file)); // Show preview
      setFieldValue("profile_pic", file); // Store file for submission
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    const token = localStorage.getItem("access_token");
  
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "profile_pic" && values.profile_pic instanceof File) {
        formData.append("profile_pic", values.profile_pic); // ✅ Correctly append image
      } else {
        formData.append(key, values[key]);
      }
    });
  
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ No Content-Type for FormData
        },
        body: formData,
      });
  
      if (response.ok) {
        const updatedData = await response.json(); // ✅ Fetch updated profile
        console.log("Updated Data:", updatedData); // Debug log to verify response
  
        // ✅ Correctly update profile pic URL
        if (updatedData.profile_pic) {
          setProfilePicture(`http://127.0.0.1:8000${updatedData.profile_pic}`);
        }
  
        // ✅ Update other profile data
        setProfile({
          ...profile,
          ...updatedData,
        });
  
        // ✅ Show Snackbar
        setOpenSnackbar(true);
  
        // ✅ Optional: Reload after saving (if necessary)
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Box m="20px" maxWidth="800px" mx="auto">
      <Header title="PROFILE INFORMATION" subtitle="Edit Profile Information" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={profile}
        validationSchema={checkoutSchema}
        enableReinitialize
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Profile Picture Upload */}
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
                        alt="Profile"
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
                        setFieldValue("profile_pic", null);
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </Box>
              </Grid>

              {/* Profile Fields */}
              <Grid item xs={12} sm={9}>
                <Grid container spacing={2}>
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

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  variant="filled"
                  label="Address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  name="address"
                  fullWidth
                />
              </Grid>

              {/* Email & Contact */}
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="filled"
                  label="Email Address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputMask
                  mask="+63 999-999-9999"
                  value={values.phone_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      variant="filled"
                      label="Contact Number"
                      name="phone_number"
                      error={touched.phone_number && !!errors.phone_number}
                      helperText={touched.phone_number && errors.phone_number}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  )}
                </InputMask>
              </Grid>

              {/* Gender & Age */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  variant="filled"
                  label="Gender"
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  variant="filled"
                  label="Age"
                  name="age"
                  value={values.age}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              {/* Account Type */}
              <Grid item xs={12}>
                <TextField
                  select
                  variant="filled"
                  label="Account Type"
                  name="account_type"
                  value={values.account_type}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="information">Information Officer</MenuItem>
                  <MenuItem value="cashier">Cashier</MenuItem>
                  <MenuItem value="agent">Agent</MenuItem>
                  <MenuItem value="client">Client</MenuItem>
                </TextField>
              </Grid>

              {/* Date Registered (Read-only) */}
              <Grid item xs={12}>
                <TextField
                  variant="filled"
                  label="Date Registered"
                  value={values.date_registered}
                  fullWidth
                  disabled
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="center" mt={2}>
              <Button type="submit" color="secondary" variant="contained" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Snackbar open={openSnackbar} autoHideDuration={1000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success">Profile updated successfully!</Alert>
      </Snackbar>
    </Box>
  );
};

// Validation Schema
const checkoutSchema = yup.object().shape({
  first_name: yup.string().required("Required"),
  middle_name: yup.string(),
  last_name: yup.string().required("Required"),
  address: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  phone_number: yup
    .string()
    .matches(/^\+63 \d{3}-\d{3}-\d{4}$/, "Contact number must be in the format +63 XXX-XXX-XXXX")
    .required("Required"),
  gender: yup.string().required("Required"),
  age: yup.number().positive().integer().required("Required"),
  account_type: yup.string().required("Required"),
  profile_pic: yup.mixed().nullable(),
});

export default AdminProfilePage;
