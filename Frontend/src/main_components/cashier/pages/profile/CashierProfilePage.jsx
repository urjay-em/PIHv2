import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';

const AdminProfilePage = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        role: '',
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [errors, setErrors] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch profile data from API or local storage and set state
        const fetchedProfile = {
            name: localStorage.getItem("account_name") || "Unknown Name",
            email: "",  // Replace with actual data
            role: localStorage.getItem("account_type") || "Unknown Role",
        };
        setProfile(fetchedProfile);
    }, []);

    const validateFields = () => {
        let errors = {};
        if (!profile.name) errors.name = "Name is required";
        if (!profile.email) errors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(profile.email)) errors.email = "Email is invalid";
        return errors;
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfilePicture(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            // Simulate save operation (replace with actual save logic)
            setTimeout(() => {
                console.log("Profile saved:", profile);
                setIsLoading(false);
                setOpenSnackbar(true);
            }, 2000);
            setErrors({});
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={3} sx={{ width: '100%', maxWidth: 600 }}>
            <Typography variant="h4" mb={2} sx={{ color: 'text.primary' }}>Edit Profile</Typography>

            {/* Profile Information Box */}
            <Box
                sx={{
                    width: '100%',
                    padding: 5,
                    borderRadius: 4,
                    boxShadow: 3,
                    backgroundColor: 'background.paper', // background color depending on the theme mode
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: (theme) => `1px solid ${theme.palette.divider}`, // Divider for separation
                }}
            >
                {/* Profile Picture Upload (Red background) */}
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mb={3}
                    sx={{
                        backgroundColor: 'transparent', // Red background for the upload container
                        padding: 2,
                        borderRadius: 8,
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <img
                        src={profilePicture || 'default-picture-url'} // Placeholder for profile picture
                        alt="Profile"
                        style={{ width: '100px', height: '100px', borderRadius: '30%', marginBottom: '10px' }}
                    />
                    <Button variant="contained" component="label">
                        Upload Picture
                        <input type="file" hidden onChange={handlePictureChange} />
                    </Button>
                </Box>

                {/* Profile Fields */}
                <TextField
                    label="Name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    label="Email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    label="Role"
                    name="role"
                    value={profile.role}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    disabled  // Role should not be editable
                    sx={{ marginBottom: 2 }}
                />

                {/* Save Button (Green background) */}
                <Button
                    variant="contained"
                    color="success" // Green background
                    onClick={handleSave}
                    disabled={isLoading}
                    width= "50%"
                    sx={{ marginTop: 2 }}
                    startIcon={isLoading ? <CircularProgress size={10} /> : null}
                >
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </Box>

            {/* Snackbar for success confirmation */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                    Profile updated successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminProfilePage;
