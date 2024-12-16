import React from 'react';
import './CommissionDetails.css';

const CommissionDetails = () => {
  return (
    <div className="commission-details-container">
      <div className="commission-details-header">
        <div className="commission-details-title">Commission Details</div>
      </div>
      <div className="commission-details-options">
        <button className="details-option">Week</button>
        <button className="details-option active">Month</button>
        <button className="details-option">Customize</button>
      </div>
      <div className="commission-details-content">
        <div className="commission-details-graph">
          <div className="graph-header">
            <div className="graph-title">₱120,000.00</div>
            <div className="graph-legend">
              <div className="legend-item">
                <div className="legend-dot"></div>
                <div className="legend-label">Current Commision</div>
              </div>
            </div>
          </div>
          <div className="graph-body">
            <div className="graph-line-container">
              <div className="graph-line"></div>
              <div className="graph-line-labels">
                <div className="graph-line-label">7/10</div>
                <div className="graph-line-label">7/11</div>
                <div className="graph-line-label">7/12</div>
                <div className="graph-line-label">7/13</div>
                <div className="graph-line-label">7/14</div>
                <div className="graph-line-label">7/15</div>
                <div className="graph-line-label">7/16</div>
              </div>
            </div>
          </div>
        </div>
        <div className="commission-details-summary">
          <div className="details-summary-item">
            <div className="details-summary-label">Account Balances</div>
            <div className="details-summary-value">₱40,000.00</div>
          </div>
          <div className="details-summary-item">
            <div className="details-summary-label">Widthdrawal Amount</div>
            <div className="details-summary-value">₱80,000.00</div>
          </div>
          <div className="details-summary-item">
            <div className="details-summary-label">Date of Widthdrawal</div>
            <div className="details-summary-value">2024/12/12</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionDetails;
