import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { FaUserShield, FaBuilding, FaDatabase, FaUsers } from 'react-icons/fa';
import { AiOutlineFileText } from 'react-icons/ai';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Bossing from '../Images/bossing.jpg';
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.grey[100],
            }}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography>{title}</Typography>
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

    useEffect(() => {
        setIsCollapsed(isAdminSidebar);
    }, [isAdminSidebar]);

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
                                {userRole || "Unknown Role"}  {/* Display user's role */}
                                <Link to="/profile" style={{ marginLeft: 7 }}>
                                    <IconButton color={colors.greenAccent[500]} aria-label="edit profile">
                                        <EditOutlinedIcon />
                                    </IconButton>
                                </Link>
                            </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box paddingleft={isCollapsed ? undefined : "10%"}>
                        <Item
                        title="Dashboard"
                        to="/admin/dashboard"
                        icon={<HomeOutlinedIcon />}
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
                        title="Manage Admin Account"
                        to="/admin/manageadminacc"
                        icon={<FaUserShield />}
                        selected={selected}
                        setSelected={setSelected}
                        />
                        <Item
                        title="Manage Agent Account"
                        to="/admin/manageagentacc"
                        icon={<PeopleOutlinedIcon />}
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
                        icon={<FaUsers />}
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
                         <Item
                        title="Contacts Information"
                        to="/admin/contacts"
                        icon={<ContactsOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        />
                    <Typography
                        variant="h6"
                        color={colors.grey[300]}
                        sx={{ m: "15px 0 5px 20px "}}
                    >
                        Pages
                    </Typography>
                        <Item 
                        title="User Profile Form"
                        to="/admin/form"
                        icon={<PersonAddIcon />}
                        selected={selected}
                        setSelected={setIsCollapsed}
                        />
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default AdminSidebar;