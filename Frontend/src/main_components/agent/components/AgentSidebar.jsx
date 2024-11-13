import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { FaUsers, FaMapMarkedAlt, FaUserCheck, FaUserMinus } from "react-icons/fa";
import Bossing from "../Images/bossing.jpg";
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

const AgentSidebar = ({ isAgentSidebar }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(isAgentSidebar);
    const [selected, setSelected] = useState("Map");
    const userRole = localStorage.getItem("account_type");
    const fullName = localStorage.getItem("account_name");

    const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("md", "lg"));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        setIsCollapsed(isAgentSidebar);
    }, [isAgentSidebar]);

    const sidebarWidth = isLargeScreen ? 250 : isMediumScreen ? 200 : isSmallScreen ? 150 : 100;
    const padding = isSmallScreen ? "5px 15px" : isMediumScreen ? "5px 20px" : "5px 25px";

    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    backgroundColor: theme.palette.mode === "light" ? colors.grey[50] : colors.primary[800],
                    borderRight: theme.palette.mode === "light" ? `1px solid ${colors.grey[300]}` : "none",
                    width: sidebarWidth,
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item": {
                    padding: `${padding} !important`,
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
                                    fontSize={isSmallScreen ? "1.0rem" : isMediumScreen ? "1.3rem" : "1.5rem"}
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
                                    src={Bossing}
                                    style={{ cursor: "pointer", borderRadius: "50%" }}
                                />
            
                                <Link to="/agent/profile">
                                    <Tooltip title="Edit profile">
                                        <Box 
                                            sx={{ 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                alignItems: 'center',
                                                position: "absolute",
                                                right: 77, // Adjust to position the icon closer or further
                                                top: "20%",
                                                transform: "translateY(-100%)",
                                            }}
                                        >
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

                                        </Box>
                                    </Tooltip>
                                </Link>
                            </Box>
                            <Box textAlign="center">
                                <Typography
                                    variant="h2"
                                    fontSize={isSmallScreen ? "1rem" : "1.5rem"}
                                    color={theme.palette.mode === "light" ? colors.grey[800] : colors.grey[100]}
                                    fontWeight="bold"
                                    sx={{ m: "10px 0 0 0" }}
                                >
                                    {fullName || "Unknown Name"}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    fontSize={isSmallScreen ? "0.5rem" : "0.9rem"}
                                    color={theme.palette.mode === "light" ? colors.greenAccent[500] : colors.greenAccent[500]}
                                >
                                    {userRole || "Unknown Role"}
                                
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title="Map"
                            to="/agent/map"
                            icon={<FaMapMarkedAlt size={isSmallScreen ? 13 : 21} />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h6"
                            fontSize={isSmallScreen ? "0.8rem" : "1rem"}
                            color={theme.palette.mode === "light" ? colors.grey[500] : colors.grey[300]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Data
                        </Typography>
                        <Item
                            title="List of Clients"
                            to="/agent/list"
                            icon={<FaUsers size={isSmallScreen ? 13 : 21} />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Approved Clients"
                            to="/agent/approvedclients"
                            icon={<FaUserCheck size={isSmallScreen ? 13 : 21} />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Declined Clients"
                            to="/agent/declinedclients"
                            icon={<FaUserMinus size={isSmallScreen ? 13 : 21} />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default AgentSidebar;
