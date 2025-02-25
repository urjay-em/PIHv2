import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './Home.css';


const Home = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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
              <h2 className="welcome-text">Welcome to Client Dashboard</h2>
              <div className="cards">
                <div className="card card-map" onClick={() => handleNavigation('/client/map')}>
                  <div className="icon">
                    <FaMapMarkerAlt size={50} />
                  </div>
                  <p>Map</p>
                </div>
              </div>
            </div>
          )}
        </div>

        </div>
    </>
  );
};

export default Home;
