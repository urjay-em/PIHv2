import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert, CircularProgress, Tabs, Tab, Divider, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const InformationOfficerProfilePage = () => {
    const navigate = useNavigate();
    const handleClose = () => {
        navigate('/');
    };
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        role: '',
        phone: '',
        address: '',
        birthDate: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [profilePicture, setProfilePicture] = useState(localStorage.getItem("profilePicture") || null);
    const [errors, setErrors] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        const fetchedProfile = {
            firstName: localStorage.getItem("firstName") || "Unknown Name",
            lastName: localStorage.getItem("lastName")||"",
            role: localStorage.getItem("account_type") || "Unknown Role",
            phone: "",
            address: "",
            birthDate: "",
        };
        setProfile(fetchedProfile);
    }, []);

    const validateFields = () => {
        let errors = {};
    
        if (!profile.firstName) errors.firstName = "First Name is required";
        if (!profile.lastName) errors.lastName = "Last Name is required";
        if (!profile.email) errors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(profile.email)) errors.email = "Email is invalid";
        if (profile.password && profile.password !== profile.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
        return errors;
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result;
                setProfilePicture(imageUrl);
                localStorage.setItem("profilePicture", imageUrl); // Save to localStorage

            };
            reader.readAsDataURL(file);
        }
    };

    
    const handleSave = async () => {
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            console.log("Saving Profile: ", profile); // Log profile before save
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

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };


    return (
        <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="100vh" bgcolor="background.default">
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '900px',
                    padding: 5,
                    borderRadius: 4,
                    boxShadow: 3,
                    backgroundColor: 'background.paper',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" mb={3} color="text.primary">
                    Edit Profile
                </Typography>

                <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <CloseIcon />
                </IconButton>

                {/* Tabs for switching between categories */}
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    centered
                    sx={{
                        mb: 4,
                        borderRadius: 2,
                    }}
                    TabIndicatorProps={{
                        style: { backgroundColor: 'currentColor' }  // Default indicator color
                    }}
                >
                    <Tab label="Personal Information" sx={{ color: 'skyblue' }} />
                    <Tab label="Security Login Credentials" sx={{ color: 'skyblue' }} />
                </Tabs>

                {/* Profile Picture */}
                <Box display="flex" flexDirection="column" alignitems="center" mb={3}>
                    <img
                        src={profilePicture || 'default-picture-url'}
                        alt="Profile"
                        style={{ width: '120px', height: '120px', borderRadius: '50%', marginBottom: '10px' }}
                    />
                    <Button variant="contained" component="label" color="primary" size="small">
                        Upload Picture
                        <input type="file" hidden onChange={handlePictureChange} />
                    </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Form Fields */}
                <Box
                    component="form"
                    display="grid"
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap={3}
                    sx={{ width: '90%', mx: 'auto' }}
                >
                    {/* Personal Information Fields */}
                    {selectedTab === 0 && (
                        <>
                            <TextField
                                label="First Name"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                            />
                            <TextField
                                label="Last Name"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                            />
                            <TextField
                                label="Role"
                                name="role"
                                value={profile.role}
                                disabled
                                fullWidth
                            />
                            <TextField
                                label="Phone Number"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="Address"
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="Birth Date"
                                name="birthDate"
                                type="date"
                                value={profile.birthDate}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </>
                    )}

                    {/* Security Login Credentials Fields */}
                    {selectedTab === 1 && (
                        <>
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={profile.email}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                value={profile.password}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                            <Box display="flex" justifyContent="center" width="100%">
                                <TextField 
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={profile.confirmPassword}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                />
                            </Box>
                        </>
                    )}
                </Box>

                {/* Save Button */}
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSave}
                    disabled={isLoading}
                    sx={{ marginTop: 4, width: '50%' }}
                    startIcon={isLoading ? <CircularProgress size={10} /> : null}
                >
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>

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
        </Box>
    );
};

export default InformationOfficerProfilePage;
