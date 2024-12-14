import React, { useState } from 'react';
import { FaBars, FaBell, FaUserCircle, FaCircle } from 'react-icons/fa';
import './AgentTopbar.css';
import LOGOO from '../../../assets/LOGOO.jpg';
import { Menu, MenuItem, IconButton, Tooltip, Divider, Badge } from '@mui/material';

const AgentTopbar = ({ toggleSidebar }) => {
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New message', type: 'message', read: false },
    { id: 2, message: 'Email confirmation', type: 'email', read: false },
    { id: 3, message: 'Approval required', type: 'approval', read: false },
  ]);

  // Handle profile menu
  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  // Handle notifications menu
  const handleNotifMenuOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifMenuClose = () => {
    setNotifAnchorEl(null);
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
          <MenuItem>View Profile</MenuItem>
          <MenuItem>Change Password</MenuItem>
          <Divider />
        </Menu>
      </div>
    </div>
  );
};

export default AgentTopbar;
