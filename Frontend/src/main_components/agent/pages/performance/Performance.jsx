import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Performance.css";

const Performance = () => {
  const [timePeriod, setTimePeriod] = useState("week");

  const performanceData = [
    { type: "Stone Type", sold: 30, target: 40 },
    { type: "Mausoleum Type", sold: 20, target: 30 },
    { type: "Lawn Type", sold: 50, target: 60 },
  ];

  return (
    <div className="performance-container">
      <h1 className="performance-title">Agent Performance Analytics</h1>
      
      {/* Filters or Dropdown for Time Period */}
      <div className="filter-container">
        <select onChange={(e) => setTimePeriod(e.target.value)}>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      {/* Chart Container */}
      <div className="chart-container">
        <h3 className="chart-title">Lot Types Sold - {timePeriod}</h3>
        <ResponsiveContainer width="75%" height="80%">
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sold" fill="rgba(246, 69, 5, 0.94)" />
            <Bar dataKey="target" fill="rgba(92, 75, 69, 0.94)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Section */}
      <div className="performance-summary">
        <div>Total Sales: 100 Lots</div>
        <div>Target Achieved: 85%</div>
        <div>Top Performer: Lawn Type</div>
      </div>

      {/* Agent Leaderboard */}
      <div className="leaderboard">
        <h3>Agent Leaderboard</h3>
        {/* Add dynamic agent ranking here */}
      </div>
    </div>
  );
};

export default Performance;
