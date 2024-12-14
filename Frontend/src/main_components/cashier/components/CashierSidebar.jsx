import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { FaUserCheck, FaCashRegister, FaRegFileExcel } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Tooltip } from "@mui/material";

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

const CashierSidebar = ({ isCashierSidebar }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(isCashierSidebar);
    const [selected, setSelected] = useState("Map");
    const userRole = localStorage.getItem("account_type");
    const fullName = localStorage.getItem("account_name");
    const [profilePicture, setProfilePicture] = useState(localStorage.getItem("profilePicture") || 'default-profile-picture-url');


    useEffect(() => {
        setIsCollapsed(isCashierSidebar);
        // Listen for changes in local storage to update profile picture
        const updateProfilePicture = () => setProfilePicture(localStorage.getItem("profilePicture"));
            window.addEventListener("storage", updateProfilePicture);
            return () => window.removeEventListener("storage", updateProfilePicture);
      }, [isCashierSidebar]);

    
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
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center',
                                            position: "absolute",
                                            right: 85, // Adjust to position the icon closer or further
                                            top: "20%",
                                            transform: "translateY(-100%)",
                                         }}
                                     >
                                        <Link to="/cashier/profile">
                                            <IconButton 
                                                sx={{ 
                                                    color: colors.grey[100],  // Icon color
                                                    backgroundColor: colors.greenAccent[500],  // Background color for the circle
                                                    borderRadius: "50%",  // Makes the background circular
                                                    padding: "2px",  // Adjust padding to control the circle size
                                                    "&:hover": {
                                                        backgroundColor: colors.greenAccent[700],  // Darker shade on hover
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
                    
                        <Typography
                            variant="h6"
                            color={theme.palette.mode === "light" ? colors.grey[500] : colors.grey[300]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Data
                        </Typography>
                        <Item
                            title="Payment Application"
                            to="/cashier/paymentapplication"
                            icon={<FaCashRegister />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Approved Clients"
                            to="/cashier/approvedclients"
                            icon={<FaUserCheck />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Commision"
                            to="/cashier/commission"
                            icon={<FaRegFileExcel />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default CashierSidebar;
