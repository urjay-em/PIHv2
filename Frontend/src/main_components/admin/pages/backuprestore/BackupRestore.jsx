import React, { useState } from "react";
import Header from "../../Header";
import BackupIcon from "@mui/icons-material/Backup";
import RestoreIcon from "@mui/icons-material/Restore";
import { Box, Tooltip, IconButton, Typography, Button, Card, CardContent, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const BackupRestore = () => {
  const [hovered, setHovered] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark"; // Check if the current mode is dark

  const handleBackupClick = () => {
    alert("Backup process initiated!");
  };

  const handleRestoreClick = () => {
    alert("Restore process initiated!");
  };

  return (
    <Box
      sx={{
        background: isDarkMode ? "linear( #141b2d, #1d2c3b)" : "linear( #ffffff, #f9f9f9)", // Dark blue for dark mode
        height: "100vh",
        padding: "20px",
        color: isDarkMode ? "#E0E0E0" : "#333333", // Light text for dark mode, dark text for light mode
      }}
    >
      {/* Header with title */}
      <Header title="BACKUP & RESTORE" />

      {/* Subtitle as subtitle1 */}
      <Typography
        variant="subtitle1"
        align="center"
        sx={{
          mt: 2,
          fontSize: "18px",
          color: isDarkMode ? "#B0B0B0" : "#4B4B4B", // Lighter text in dark mode
        }}
      >
        Manage and secure your data by performing backup or restore operations below.
      </Typography>

      {/* Interactive Icon Section */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt="50px"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Tooltip title={hovered ? "Restore" : "Backup"}>
            <IconButton
              onClick={hovered ? handleRestoreClick : handleBackupClick}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                width: 150,
                height: 150,
                backgroundColor: isDarkMode ? "#3B3B3B" : "#f5f5f5", // Darker background for dark mode
                borderRadius: "50%",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
              }}
            >
              {hovered ? (
                <RestoreIcon style={{ fontSize: 50, color: "#2575fc" }} />
              ) : (
                <BackupIcon style={{ fontSize: 50, color: "#2575fc" }} />
              )}
            </IconButton>
          </Tooltip>
        </motion.div>

        {/* Tooltip Text as body1 */}
        <Typography
          variant="body1"
          align="center"
          sx={{
            mt: 2,
            fontSize: "16px",
            color: isDarkMode ? "#B0B0B0" : "#4B4B4B", // Lighter text in dark mode
          }}
        >
          {hovered
            ? "Restore your data from a previous backup."
            : "Backup your current data for safekeeping."}
        </Typography>
      </Box>

      {/* Additional Actions Section */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt="40px"
        gap="20px"
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            backgroundColor: "#1976d2",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            "&:hover": { backgroundColor: "#145ca8" },
          }}
          onClick={() => alert("Schedule Backup feature coming soon!")}
        >
          Schedule Backup
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            borderColor: "#fff",
            color: "#fff",
            "&:hover": { borderColor: "#ccc", color: "#ccc" },
          }}
          onClick={() => alert("View Backup Logs feature coming soon!")}
        >
          View Logs
        </Button>
      </Box>

      {/* Card Section for Info */}
      <Box
        display="flex"
        justifyContent="center"
        gap="20px"
        mt="50px"
        flexWrap="wrap"
      >
        <Card sx={{ maxWidth: 300, backgroundColor: isDarkMode ? "#3B3B3B" : "#fff", color: isDarkMode ? "#E0E0E0" : "#000" }}>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              Automatic Backups
            </Typography>
            <Typography variant="body2" align="center">
              Configure your system to perform daily automatic backups to keep your data secure.
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ maxWidth: 300, backgroundColor: isDarkMode ? "#3B3B3B" : "#fff", color: isDarkMode ? "#E0E0E0" : "#000" }}>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>
              Restore Options
            </Typography>
            <Typography variant="body2" align="center">
              Restore specific files or entire system backups from your saved restore points.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default BackupRestore;
