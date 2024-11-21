import React from "react";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const AdminDashboard = () => {

  const theme = useTheme();
  // Sample data
  const lotStatusData = [
    { name: "Occupied Lots", value: 350 },
    { name: "Available Lots", value: 150 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 7000 },
    { month: "May", revenue: 6000 },
  ];

  const activityData = [
    { month: "Jan", occupied: 30, available: 20 },
    { month: "Feb", occupied: 40, available: 25 },
    { month: "Mar", occupied: 50, available: 30 },
    { month: "Apr", occupied: 60, available: 35 },
    { month: "May", occupied: 70, available: 40 },
  ];

  const COLORS = ["#4caf50", "#f44336", "#ffc107", "#2196f3"];

  return (
    <div style={dashboardContainer}>
      <h1 style={dashboardTitle}>Admin Dashboard</h1>
      <div style={gridContainer}>
        {/* Pie Chart */}
        <div style={gridItem}>
          <h3 style={chartTitle}>Lot Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={lotStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={80} // Adjust the radius
                fill="#8884d8"
                label
              >
                {lotStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart */}
        <div style={gridItem}>
          <h3 style={chartTitle}>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#4caf50" fill="#4caf50" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div style={gridItem}>
          <h3 style={chartTitle}>Lot Activity (Monthly)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="occupied" fill="#2196f3" />
              <Bar dataKey="available" fill="#ffc107" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div style={gridItem}>
          <h3 style={chartTitle}>Occupied vs Available Lots</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="occupied" stroke="#f44336" />
              <Line type="monotone" dataKey="available" stroke="#4caf50" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Styles
const dashboardContainer = {
  padding: "20px",
  background: (theme) => `linear-gradient(to bottom, ${theme.palette.primary.light}, ${theme.palette.background.default})`,
  minHeight: "100vh",
};

const dashboardTitle = {
  textAlign: "center",
  marginBottom: "20px",
  color: (theme) => theme.palette.text.primary,   
  fontSize: "2.5rem",
  fontWeight: theme => theme.typography.fontWeightBold,
};

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr", // Two columns only
  gap: "20px",
};

const gridItem = {
  background: "linear-gradient(to bottom, #ffffff, #f1f1f1)",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s, box-shadow 0.3s",
  cursor: "pointer",
};

const chartTitle = {
  textAlign: "center",
  marginBottom: "10px",
  color: "#555",
  fontSize: "1.25rem",
  fontWeight: "bold",
};

gridItem["&:hover"] = {
  transform: "scale(1.02)",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
};

export default AdminDashboard;
