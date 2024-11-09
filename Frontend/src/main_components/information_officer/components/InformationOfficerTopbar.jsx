import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, IconButton, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, } from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined"
import SearchIcon from "@mui/icons-material/Search";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const InformationOfficerTopbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Open confirmation dialog
  const handleLogoutClick = () => {
    setOpenDialog(true);
  };

  // Close confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Confirm logout action
  const confirmLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');

    // Redirect to the login page
    navigate('/login');


    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
      }
    }, [navigate]);
  };


  
  
  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleMenuOpen}>
          <AccountCircleOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem>
            <IconButton>
              <SettingsOutlinedIcon />
            </IconButton>
            Account Setting
          </MenuItem>
          <MenuItem>
            <IconButton onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === "dark" ? (
                <LightModeOutlinedIcon />
              ) : (
                <DarkModeOutlinedIcon />
              )}
            </IconButton>
            DarkMode
          </MenuItem>
          <MenuItem onClick={handleLogoutClick}>
            <IconButton>
              <PowerSettingsNewIcon />
            </IconButton>
            Log out
          </MenuItem>
        </Menu>

        {/* Logout Confirmation Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{"Confirm Logout"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to log out? This will end your session, and
              you'll need to log in again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmLogout} color="error">
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default InformationOfficerTopbar;