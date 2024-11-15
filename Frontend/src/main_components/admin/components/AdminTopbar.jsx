import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box, IconButton, useTheme, Menu, MenuItem, Badge, Tooltip, Divider, Typography, Modal, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, InputBase
} from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const AdminTopbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  // States for menus and dialogs
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Sample notifications
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New message", type: "message", read: false },
    { id: 2, message: "Email confirmation", type: "email", read: false },
    { id: 3, message: "Approval required", type: "approval", read: false },
  ]);

  // Functions for menus
  const handleMenuOpen = (event, menuType) => {
    if (menuType === "account") setAnchorEl(event.currentTarget);
    if (menuType === "notifications") setNotifAnchorEl(event.currentTarget);
    if (menuType === "profile") setProfileAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (menuType) => {
    if (menuType === "account") setAnchorEl(null);
    if (menuType === "notifications") setNotifAnchorEl(null);
    if (menuType === "profile") setProfileAnchorEl(null);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  // Logout-related functions
  const handleLogoutClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem("full_name");
    localStorage.removeItem("account_type");
    // Refresh the page and navigate to the login page
    window.location.reload();  // This will refresh the page
    
    // Alternatively, you can navigate after a slight delay to ensure the page reloads before the navigation occurs
    setTimeout(() => {
        navigate('/login', { replace: true });
    }, 100);  // Small delay (100ms) to ensure the reload happens first
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex" alignItems="center">
        {/* Status Indicator */}
        <Tooltip title="Active">
          <IconButton onClick={(e) => handleMenuOpen(e, "status")}>
            <FiberManualRecordIcon color="success" />
          </IconButton>
        </Tooltip>

        {/* Notification Icon with Badge */}
        <Tooltip title="Notifications">
          <IconButton onClick={(e) => handleMenuOpen(e, "notifications")}>
            <Badge badgeContent={notifications.filter((n) => !n.read).length} color="error">
              <NotificationsOutlinedIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={() => handleMenuClose("notifications")}
        >
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <MenuItem key={notif.id} onClick={() => markAsRead(notif.id)}>
                <Typography style={{ fontWeight: notif.read ? 'normal' : 'bold' }}>
                  {notif.message}
                </Typography>
              </MenuItem>
            ))
          ) : (
            <MenuItem>No new notifications</MenuItem>
          )}
        </Menu>

        {/* Profile Icon with Profile Menu */}
        <IconButton onClick={(e) => handleMenuOpen(e, "profile")}>
          <AccountCircleOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={() => handleMenuClose("profile")}
        >
          <MenuItem>View Profile</MenuItem>
          <MenuItem>Change Password</MenuItem>
        </Menu>

        {/* 3-Dots Menu for Settings, Help Center, Dark Mode Toggle, and Logout */}
        <Tooltip title="More">
          <IconButton onClick={(e) => handleMenuOpen(e, "account")}>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleMenuClose("account")}
        >
          <MenuItem>
            <IconButton>
              <SettingsOutlinedIcon />
            </IconButton>
            Settings
          </MenuItem>
          <MenuItem onClick={() => setHelpOpen(true)}>
            <IconButton>
              <HelpOutlineIcon />
            </IconButton>
            Help Center
          </MenuItem>
          <MenuItem
            onClick={() => {
              colorMode.toggleColorMode();
              handleMenuClose("account");
            }}
          >
            <IconButton>
              {theme.palette.mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
            {theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
          </MenuItem>
          <MenuItem onClick={handleLogoutClick}>
            <IconButton>
              <PowerSettingsNewIcon />
            </IconButton>
            Log out
          </MenuItem>
        </Menu>

        {/* Help Center Modal */}
        <Modal open={helpOpen} onClose={() => setHelpOpen(false)}>
          <Box
            p={4}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 300,
              backgroundColor: 'white',
              borderRadius: 8,
              boxShadow: 24,
            }}
          >
            <Typography variant="h6">Help Center</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography>For support, visit our FAQ or contact us.</Typography>
            <Button sx={{ mt: 2 }} variant="contained" onClick={() => setHelpOpen(false)}>
              Close
            </Button>
          </Box>
        </Modal>

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

export default AdminTopbar;
