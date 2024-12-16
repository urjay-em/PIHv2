import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { AiOutlineFileText } from "react-icons/ai";
import './Commission.css';
import { Tooltip } from "@mui/material";

// Desktop View
const CommissionDesktop = () => {
  return (
    <div className="commission-container">
      <div className="commission-header">
        <h1 className="commission-title">Commission</h1>
        
        {/* Wrap the icon with Tooltip */}
        <Tooltip title="View Commission Details" arrow>
          <Link to="/agent/commission-details">
            <AiOutlineFileText className="commission-details-icon" />
          </Link>
        </Tooltip>
      </div>

      <div className="commission-amount">
        <span className="commission-label">Amount of money (₱)</span>
        <span className="commission-value">₱120,000.00</span>
        <button className="commission-withdraw-btn">Withdraw</button>
      </div>
      <div className="commission-details">
        <div className="commission-detail">
          <span className="commission-detail-label">Settled bill</span>
          <span className="commission-detail-value">₱120,000.00</span>
        </div>
        <div className="commission-detail">
          <span className="commission-detail-label">This month</span>
          <span className="commission-detail-value">₱100,000.00</span>
        </div>
      </div>
      <div className="commission-performance">
        <h2 className="commission-performance-title">Performance data</h2>
        <div className="commission-performance-item">
          <span className="commission-performance-label">Today</span>
          <span className="commission-performance-value">₱20,000</span>
        </div>
        <div className="commission-performance-item">
          <span className="commission-performance-label">Yesterday</span>
          <span className="commission-performance-value">₱10,000.00</span>
        </div>
        <div className="commission-performance-item">
          <span className="commission-performance-label">Week</span>
          <span className="commission-performance-value">₱50,000.00</span>
        </div>
        <div className="commission-performance-item">
          <span className="commission-performance-label">Month</span>
          <span className="commission-performance-value">₱10,000.00</span>
        </div>
      </div>
      <div className="commission-performance-item">
        <span className="commission-performance-label">Estimated Income</span>
        <span className="commission-performance-value">₱130,000.00</span>
      </div>
      <div className="commission-activities">
        <div className="commission-activity">
          <span className="commission-activity-label">Commission withdrawal</span>
          <span className="commission-activity-value">₱80,000.00</span>
        </div>
        <div className="commission-activity">
          <span className="commission-activity-label">Commission settlement</span>
          <span className="commission-activity-value">₱50,000.00</span>
        </div>
      </div>
    </div>
  );
};

// Responsive Component
const Commission = () => {
  return (
    <div>
      <CommissionDesktop />
    </div>
  );
};

export default Commission;
