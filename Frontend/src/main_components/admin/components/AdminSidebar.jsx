import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { FaUserShield, FaBuilding, FaDatabase, FaUsers } from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: theme.palette.mode === "light" ? colors.grey[800] : colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography variant="body1">{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const AdminSidebar = ({ isAdminSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(isAdminSidebar);
  const [selected, setSelected] = useState("Dashboard");
  const userRole = localStorage.getItem("account_type");
  const fullName = localStorage.getItem("account_name");
  const [profilePicture, setProfilePicture] = useState(localStorage.getItem("profilePicture") || 'default-profile-picture-url');

  useEffect(() => {
    setIsCollapsed(isAdminSidebar);
    // Listen for changes in local storage to update profile picture
    const updateProfilePicture = () => setProfilePicture(localStorage.getItem("profilePicture"));
        window.addEventListener("storage", updateProfilePicture);
        return () => window.removeEventListener("storage", updateProfilePicture);
  }, [isAdminSidebar]);

  return (
    <Box
      sx={{

        "& .pro-sidebar-inner": {
          backgroundColor: theme.palette.mode === "light" ? colors.grey[50] : colors.primary[800],
          borderRight: theme.palette.mode === "light" ? `1px solid ${colors.grey[300]}` : "none",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 25px 5px 10px !important",
        },
        "& .pro-inner-item:hover": {
          color: theme.palette.mode === "light" ? colors.blueAccent[600] : colors.blueAccent[200],
        },
        "& .pro-menu-item.active": {
          color: theme.palette.mode === "light" ? colors.blueAccent[700] : colors.blueAccent[300],
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* Menu Toggle */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: theme.palette.mode === "light" ? colors.grey[800] : colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                <Typography
                  variant="h3"
                  color={theme.palette.mode === "light" ? colors.grey[800] : colors.grey[100]}
                >
                  PIHMP-BLIMAPS
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* User Info */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="user"
                  width="80"
                  height="80"
                  src={profilePicture}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
                
                <Tooltip title="Edit profile">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "absolute",
                      right: 85, 
                      top: "20%",
                      transform: "translateY(-100%)",
                    }}
                  >
                    <Link to="/admin/profile">
                      <IconButton
                        sx={{
                          color: colors.grey[100],
                          backgroundColor: colors.greenAccent[500],
                          borderRadius: "50%",
                          padding: "2px",
                          "&:hover": {
                            backgroundColor: colors.greenAccent[700],
                          },
                        }}
                        aria-label="edit profile"
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                    </Link>
                  </Box>
                </Tooltip>
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={theme.palette.mode === "light" ? colors.grey[800] : colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {fullName || "Unknown Name"}
                </Typography>
                <Typography
                  variant="h5"
                  color={theme.palette.mode === "light" ? colors.greenAccent[500] : colors.greenAccent[500]}
                >
                  {userRole || "Unknown Role"}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/admin/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={theme.palette.mode === "light" ? colors.grey[500] : colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Manage Agent Account"
              to="/admin/manageagentacc"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Manage Client Account"
              to="/admin/manageclientacc"
              icon={<FaUsers />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Manage Branches"
              to="/admin/managebranches"
              icon={<FaBuilding />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Manage Employee Account"
              to="/admin/manageemployeeacc"
              icon={<FaUserShield />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Backup & Restore"
              to="/admin/backuprestore"
              icon={<FaDatabase />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Reports"
              to="/admin/reports"
              icon={<AiOutlineFileText />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Typography
              variant="h6"
              color={theme.palette.mode === "light" ? colors.grey[500] : colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="User Profile Form"
              to="/admin/form"
              icon={<PersonAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default AdminSidebar;
