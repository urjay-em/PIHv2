import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const ClientDashboard = () => {
  const accountStatuses = [
    { plot: "1B1", status: "Paid", purchaseDate: "December 5", totalAmount: "300,000 PHP", paidAmount: "50,000 PHP", agent: "Jake" },
    { plot: "2B1", status: "Pending Payment", purchaseDate: "November 10", totalAmount: "250,000 PHP", paidAmount: "0 PHP", agent: "Goten" },
    { plot: "3B1", status: "In Progress", purchaseDate: "October 20", totalAmount: "280,000 PHP", paidAmount: "150,000 PHP", agent: "Maris" },
    { plot: "4B1", status: "Completed", purchaseDate: "September 15", totalAmount: "350,000 PHP", paidAmount: "350,000 PHP", agent: "Anthony" },
  ];

  const pihPromotions = [
    { title: "New Development!", description: "Discover our new housing project near the city." },
    { title: "Special Offers", description: "Get a 10% discount on your next purchase!" },
    { title: "Upcoming Events", description: "Join us for a property showcase this weekend." },
  ];

  const [selectedPlot, setSelectedPlot] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  // Plot Details Dialog
  const handlePlotClick = (plot) => {
    setSelectedPlot(plot);
  };

  const handleCloseDialog = () => {
    setSelectedPlot(null);
  };

  // Logout Functionality
  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("full_name");
    localStorage.removeItem("account_type");
    // Refresh the page and navigate to the login page
    window.location.reload();
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  return (
    <Box sx={{ height: "100vh", overflowY: "auto", backgroundColor: "#f4f7fb" }}>
      {/* AppBar with Logout */}
      <AppBar position="static" sx={{ bgcolor: "#2196f3", boxShadow: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton color="inherit" title="Report a Problem">
            <ReportProblemIcon />
          </IconButton>
          <IconButton color="inherit" title="Settings">
            <SettingsIcon />
          </IconButton>
          <IconButton color="inherit" title="Logout" onClick={handleLogoutClick}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Welcome Section */}
      <Box sx={{ padding: 3, display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ffffff", boxShadow: 1, marginTop: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2196f3" }}>Welcome, Kupal</Typography>
        <Button variant="outlined" color="primary" size="small" sx={{ borderColor: "#2196f3", color: "#2196f3", "&:hover": { borderColor: "#1976d2", backgroundColor: "#e3f2fd" } }}>
          Edit Profile
        </Button>
      </Box>

      {/* Main Grid Content */}
      <Grid container spacing={3} sx={{ padding: 3 }}>
        {/* Map Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: "#f28d4d", color: "#fff", "&:hover": { bgcolor: "#f57c00" }, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Map</Typography>
              <Typography variant="body2">Explore the location of all available plots.</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: "#81c784", color: "#fff", "&:hover": { bgcolor: "#66bb6a" }, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Payment</Typography>
              <Typography variant="body2">Check payment status and make payments.</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Transaction History Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: "#fff176", "&:hover": { bgcolor: "#ffee58" }, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Transaction History</Typography>
              <Typography variant="body2">View and manage your past transactions.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Account Status and Promotions */}
      <Box sx={{ padding: 3, display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
        <Box sx={{ flex: 2 }}>
          <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>Account Status</Typography>
          <Grid container spacing={2}>
            {accountStatuses.map((status, index) => (
              <Grid item xs={12} key={index}>
                <Card onClick={() => handlePlotClick(status)} sx={{ cursor: "pointer", "&:hover": { boxShadow: 6, bgcolor: "#e8e8e8" }, boxShadow: 1, padding: 2 }}>
                  <CardContent>
                    <Typography variant="body1">
                      <strong>{status.plot}:</strong> {status.status}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>What's New on PIH</Typography>
          <Grid container spacing={2}>
            {pihPromotions.map((promo, index) => (
              <Grid item xs={12} key={index}>
                <Card sx={{ bgcolor: "#f5f5f5", "&:hover": { bgcolor: "#e0e0e0" }, boxShadow: 1, padding: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{promo.title}</Typography>
                    <Typography variant="body2">{promo.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Plot Details Dialog */}
      {selectedPlot && (
        <Dialog open={Boolean(selectedPlot)} onClose={handleCloseDialog}>
          <DialogTitle>Plot Details: {selectedPlot.plot}</DialogTitle>
          <DialogContent>
            <Typography variant="body1"><strong>Status:</strong> {selectedPlot.status}</Typography>
            <Typography variant="body1"><strong>Paid:</strong> {selectedPlot.paidAmount}</Typography>
            <Typography variant="body1"><strong>Total:</strong> {selectedPlot.totalAmount}</Typography>
            <Typography variant="body1"><strong>Purchase Date:</strong> {selectedPlot.purchaseDate}</Typography>
            <Typography variant="body1"><strong>Agent:</strong> {selectedPlot.agent}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog open={openLogoutDialog} onClose={handleCloseLogoutDialog}>
        <DialogTitle>{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out? This will end your session, and you'll need to log in again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientDashboard;
