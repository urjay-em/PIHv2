import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaUsers, FaMoneyBillAlt } from 'react-icons/fa';
import Calendar from 'react-calendar'; // React Calendar library
import 'react-calendar/dist/Calendar.css';
import './AgentDashboard.css';

// Example placeholder components for each page
const MapPage = () => <div className="page-content">Map Content</div>;
const ClientsPage = () => <div className="page-content">Clients Content</div>;
const CommissionsPage = () => <div className="page-content">Commissions Content</div>;

const AgentDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setIsCollapsed(true);
    setTimeout(() => {
      navigate(path);
    }, 300); // Match CSS transition duration
  };

  return (
    <>
      <div className="dashboard-container">
        {/* Main Dashboard Content */}
        <div className={`dashboard-content ${isCollapsed ? 'collapsed' : ''}`}>
          {!isCollapsed && (
            <div className="main">
              <h2 className="welcome-text">Welcome to Agent Dashboard</h2>
              <div className="cards">
                <div className="card card-map" onClick={() => handleNavigation('/agent/map')}>
                  <div className="icon">
                    <FaMapMarkerAlt size={50} />
                  </div>
                  <p>Map</p>
                </div>
                <div className="card card-clients" onClick={() => handleNavigation('/agent/clients')}>
                  <div className="icon">
                    <FaUsers size={50} />
                  </div>
                  <p>List of Clients</p>
                </div>
                <div className="card card-commission" onClick={() => handleNavigation('/agent/commissions')}>
                  <div className="icon">
                    <FaMoneyBillAlt size={50} />
                  </div>
                  <p>Commission</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar for Calendar and Announcements */}
        
          <div className="calendar-section">
            <h3>CALENDAR</h3>
            <Calendar onChange={setDate} value={date} />
          </div>
          <div className="announcement-section">
            <h3>ANNOUNCEMENT</h3>
            <ul>
              <li>Meeting with Client A on {date.toDateString()}</li>
              <li>Submit reports by Friday</li>
              <li>New updates on commissions</li>
            </ul>
          </div>
        </div>
      

      {/* Routing Logic */}
      <Routes>
        <Route path="/agent/map" element={<MapPage />} />
        <Route path="/agent/clients" element={<ClientsPage />} />
        <Route path="/agent/commissions" element={<CommissionsPage />} />
      </Routes>
    </>
  );
};

export default AgentDashboard;
