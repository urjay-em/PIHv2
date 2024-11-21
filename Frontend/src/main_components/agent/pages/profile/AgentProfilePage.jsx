import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Snackbar, Alert, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Header from '../../Header';
import { useNavigate } from 'react-router-dom';

const AgentProfilePage = () => {
    const navigate = useNavigate();
    const handleClose = () => {
        navigate('/');
    };
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        role: '',
    });
    const [profilePicture, setProfilePicture] = useState(localStorage.getItem("profilePicture") || null);
    const [errors, setErrors] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
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
            setTimeout(() => {
                console.log("Profile saved:", profile);
                setIsLoading(false);
                setOpenSnackbar(true);
            }, 2000);
            window.location.reload();
            setErrors({});
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <Box m="20px" maxWidth="800px" mx="auto">
            <Header title="Profile Information" subtitle="Edit Profile Information" />

            <Box
                sx={{
                    width: '100%',
                    padding: 5,
                    borderRadius: 4,
                    boxShadow: 3,
                    backgroundColor: 'background.paper',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
            >
                <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <CloseIcon />
                </IconButton>

                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mb={3}
                    sx={{
                        backgroundColor: 'transparent',
                        padding: 2,
                        borderRadius: 8,
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <img
                        src={profilePicture || 'default-picture-url'}
                        alt="Profile"
                        style={{ width: '100px', height: '100px', borderRadius: '30%', marginBottom: '10px' }}
                    />
                    <Button variant="contained" component="label">
                        Upload Picture
                        <input type="file" hidden onChange={handlePictureChange} />
                    </Button>
                </Box>

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
                    disabled
                    sx={{ marginBottom: 2 }}
                />

                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSave}
                    disabled={isLoading}
                    sx={{ marginTop: 2 }}
                    startIcon={isLoading ? <CircularProgress size={10} /> : null}
                >
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </Box>

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

export default AgentProfilePage;
