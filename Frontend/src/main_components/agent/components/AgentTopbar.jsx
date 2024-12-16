import React, { useState } from 'react';
import { FaBars, FaBell, FaUserCircle, FaCircle } from 'react-icons/fa';
import './AgentTopbar.css';
import bossing from '../../../assets/bossing.jpg';
import LOGOO from '../../../assets/LOGOO.jpg';
import { Menu, MenuItem, IconButton, Tooltip, Divider, Badge, Modal, Box } from '@mui/material';

const AgentTopbar = ({ toggleSidebar }) => {
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New message', type: 'message', read: false },
    { id: 2, message: 'Email confirmation', type: 'email', read: false },
    { id: 3, message: 'Approval required', type: 'approval', read: false },
  ]);

  // User Data
  const userData = {
    firstName: 'Aizel',
    middleName: 'Hoyo-a',
    lastName: 'Cantado',
    address: 'Brgy. Tiniguiban',
    email: 'agent@example.com',
    contactNumber: '09106032251',
    profilePicture: bossing, // Replace with actual image
  };

  // Handle Profile Menu
  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  // Handle Notifications Menu
  const handleNotifMenuOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifMenuClose = () => {
    setNotifAnchorEl(null);
  };

  // Toggle Profile Modal
  const handleViewProfile = () => {
    setShowProfile(true);
    handleProfileMenuClose();
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  // Mark notifications as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  return (
    <div className="topbar">
      {/* Left Section */}
      <div className="topbar-left">
        <FaBars className="menu-icon" onClick={toggleSidebar} />
        <div className="topbar-logo">
          <img src={LOGOO} alt="Logo" className="logo-img" />
          <span className="logo-text">PIH-AGENT</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="topbar-right">
        {/* Status Icon */}
        <FaCircle className="status-icon" />

        {/* Notification Icon */}
        <Tooltip title="Notifications">
          <IconButton onClick={handleNotifMenuOpen}>
            <Badge badgeContent={notifications.filter((notif) => !notif.read).length} color="error">
              <FaBell className="notification-icon" />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={handleNotifMenuClose}
        >
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <MenuItem key={notif.id} onClick={() => markAsRead(notif.id)}>
                <span style={{ fontWeight: notif.read ? 'normal' : 'bold' }}>
                  {notif.message}
                </span>
              </MenuItem>
            ))
          ) : (
            <MenuItem>No new notifications</MenuItem>
          )}
        </Menu>

        {/* Profile Icon with Menu */}
        <Tooltip title="Profile">
          <IconButton onClick={handleProfileMenuOpen}>
            <FaUserCircle className="user-icon" />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
          <MenuItem>Change Password</MenuItem>
          <Divider />
        </Menu>
      </div>

      {/* Profile View Modal */}
      <Modal open={showProfile} onClose={handleCloseProfile}>
        <Box className="profile-modal">
          <h2>Profile Information</h2>
          <div className="profile-container">
            <div className="profile-picture">
              <img
                src={userData.profilePicture}
                alt="Profile"
                style={{ width: '150px', borderRadius: '10px' }}
              />
            </div>
            <div className="profile-details">
              <p><strong>First Name:</strong> {userData.firstName}</p>
              <p><strong>Middle Name:</strong> {userData.middleName}</p>
              <p><strong>Last Name:</strong> {userData.lastName}</p>
              <p><strong>Address:</strong> {userData.address}</p>
              <p><strong>Email Address:</strong> {userData.email}</p>
              <p><strong>Contact Number:</strong> {userData.contactNumber}</p>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AgentTopbar;
