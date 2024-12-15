import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Modal,
  Typography,
  TextField,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { ColorModeContext } from '../../../theme';  // Assuming you have this context for color mode toggle

import './AgentSidebar.css';

const AgentSidebar = ({ isCollapsed }) => {
  const colorMode = useContext(ColorModeContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [settingsValue, setSettingsValue] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);

  // Logout functionality
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
    localStorage.removeItem('full_name');
    localStorage.removeItem('account_type');
    // Refresh the page and navigate to the login page
    window.location.reload();
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  // Settings dialog functions
  const handleSettingsClick = () => {
    setSettingsDialogOpen(true);
  };

  const handleCloseSettingsDialog = () => {
    setSettingsDialogOpen(false);
  };

  const handleSettingsChange = (e) => {
    setSettingsValue(e.target.value);
  };

  const handleSaveSettings = () => {
    // Save settings value (this can be enhanced to store settings in a database or local storage)
    alert(`Settings saved: ${settingsValue}`);
    setSettingsDialogOpen(false);
  };

  // Help modal toggle
  const handleHelpOpen = () => {
    setHelpOpen(true);
  };

  const handleHelpClose = () => {
    setHelpOpen(false);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Menu Items */}
      <Link to="/agent/dashboard" className="menu-item">
        <FaHome className="menu-icon" />
        {!isCollapsed && <span>Home</span>}
      </Link>
      <Link to="/agent/performance" className="menu-item">
        <FaChartBar className="menu-icon" />
        {!isCollapsed && <span>Performance</span>}
      </Link>
      <div className="menu-item" onClick={handleSettingsClick}>
        <FaCog className="menu-icon" />
        {!isCollapsed && <span>Settings</span>}
      </div>
      <div className="menu-item-signout" onClick={handleLogoutClick}>
        <FaSignOutAlt className="menu-icon" />
        {!isCollapsed && <span>Sign Out</span>}
      </div>

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

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onClose={handleCloseSettingsDialog}>
        <DialogTitle>{"Settings"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Modify your agent settings here.
          </DialogContentText>

          {/* Dark Mode / Light Mode Toggle */}
          <div>
            <IconButton onClick={colorMode.toggleColorMode}>
              {colorMode.mode === 'dark' ? (
                <LightModeOutlinedIcon />
              ) : (
                <DarkModeOutlinedIcon />
              )}
            </IconButton>
            <span>
              {colorMode.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </div>

          {/* Help Icon */}
          <div style={{ marginTop: '16px' }}>
            <Tooltip title="Help Center">
              <IconButton onClick={handleHelpOpen}>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
            <span>Help</span>
          </div>

          <TextField
            label="Settings"
            fullWidth
            variant="outlined"
            value={settingsValue}
            onChange={handleSettingsChange}
            sx={{ mb: 2, mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettingsDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Help Modal */}
      <Modal open={helpOpen} onClose={handleHelpClose}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: 24,
            padding: '20px',
          }}
        >
          <Typography variant="h6">Help Center</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography>
            For support, visit our FAQ or contact us for assistance.
          </Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={handleHelpClose}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AgentSidebar;
