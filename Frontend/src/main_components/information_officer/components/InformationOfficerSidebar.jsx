import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { FaUsers, FaMapMarkedAlt,  FaUserCheck, } from "react-icons/fa";
import Bossing from "../Images/bossing.jpg";

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.grey[500],
            }}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to} />
        </MenuItem>
    );
};

const InformationOfficerSidebar = ({ isInformationOfficerSidebar }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(isInformationOfficerSidebar);
    const [selected, setSelected] = useState("Map");
    const userRole = localStorage.getItem("account_type");
    const fullName = localStorage.getItem("account_name");

    useEffect(() => {
        setIsCollapsed(isInformationOfficerSidebar);
    }, [isInformationOfficerSidebar]);

    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    background: '${theme.palette.mode === "light" ? colors.lightBlue.main : colors.primary[400]} !important',  
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                },
                "& .pro-inner-item:hover": {
                    color: theme.palette.mode === "light" ? colors.lightBlue.hover : "868dfb !important",
                },
                "& .pro-menu-item.active": {
                    color: "#687fa !important",
                },
                [theme.breakpoints.down('lg')]: {
                    '& .pro-sidebar-inner': {
                    width: 250, // adjust width for large screens
                    },
                    '& .pro-inner-item': {
                    padding: '5px 30px 5px 15px !important',
                    },
                },
                [theme.breakpoints.down('md')]: {
                    '& .pro-sidebar-inner': {
                    width: 200, // adjust width for medium screens
                    },
                    '& .pro-inner-item': {
                    padding: '5px 25px 5px 10px !important',
                    },
                },
                [theme.breakpoints.down('sm')]: {
                    '& .pro-sidebar-inner': {
                    width: 150, // adjust width for small screens
                    },
                    '& .pro-inner-item': {
                    padding: '5px 20px 5px 5px !important',
                    },
                },
                [theme.breakpoints.down('xs')]: {
                    '& .pro-sidebar-inner': {
                    width: 100, // adjust width for extra small screens
                    },
                    '& .pro-inner-item': {
                    padding: '5px 15px 5px 0px !important',
                    },
                },
            }}
        >
            <ProSidebar collapsed={isCollapsed}>
            <Menu iconShape="square">
                {/*LOGO & MENU ICON*/}
                <MenuItem
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                    style={{
                        margin: "10px 0 20px 0",
                        color: colors.grey[100],
                    }}
                >
                    {!isCollapsed && (
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            ml="15px"
                        >
                            <Typography variant="h3" color={colors.grey[100]}>
                                PIHMP-BLIMAPS
                            </Typography>
                            <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                <MenuOutlinedIcon/>
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
                            </Box>
                            <Box textAlign="center">
                                <Typography
                                variant="h2"
                                color={colors.grey[100]}
                                fontWeight="bold"
                                sx={{ m: "10px 0 0 0"}}
                            >
                            {fullName || "Unknown Name"}
                            </Typography>
                            <Typography variant="h5" color={colors.greenAccent[500]}>
                            {userRole || "Unknown Role"}
                            </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box paddingleft={isCollapsed ? undefined : "10%"}>
                        <Item
                        title="Map"
                        to="/information_officer/information-officer-map"
                        icon={<FaMapMarkedAlt />}
                        selected={selected}
                        setSelected={setSelected}
                        />

                        <Typography
                        variant="h6"
                        color={colors.grey[300]}
                        sx={{ m: "15px 0 5px 20px" }}
                    >
                        data
                    </Typography>
                        <Item
                        title="List of Agent"
                        to="/information_officer/agentlist"
                        icon={<FaUsers />}
                        selected={selected}
                        setSelected={setSelected}
                        />
                        <Item
                        title="Approved Client"
                        to="/information_officer/approvedclients"
                        icon={<FaUserCheck />}
                        selected={selected}
                        setSelected={setSelected}
                        />
                        
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default InformationOfficerSidebar;