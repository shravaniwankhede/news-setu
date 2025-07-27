import React from "react";
import { useTheme } from "./context/ThemeContext.jsx";
import "./styles/Analytics.css";

const Analytics = ({ onPageChange }) => {
  const { theme } = useTheme();
  const totalArticles = 1247;
  const avgPoliticalBias = 34;
  const avgEmotionalBias = 41;
  const lowBiasArticles = 42;
  const moderateBias = 35;
  const highBias = 23;

  const handleClose = () => {
    onPageChange('landing');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <button className="close-btn" onClick={handleClose}>✕ Close</button>
      </div>

      <h2 className="dashboard-subtitle">📊 Bias Analytics Overview</h2>

      <div className="cards-grid">
        <div className="cardz">
          <p className="cardz-title">Total Articles</p>
          <p className="cardz-value">{totalArticles}</p>
          <p className="cardz-subtext">Analyzed today</p>
        </div>

        <div className="cardz">
          <p className="cardz-title">Avg Political Bias</p>
          <p className="cardz-value orange">{avgPoliticalBias}%</p>
          <p className="cardz-subtext">↓ Lower than yesterday</p>
        </div>

        <div className="cardz">
          <p className="cardz-title">Avg Emotional Bias</p>
          <p className="cardz-value red">{avgEmotionalBias}%</p>
          <p className="cardz-subtext">↑ Higher than yesterday</p>
        </div>

        <div className="cardz">
          <p className="cardz-title">Low Bias Articles</p>
          <p className="cardz-value green">{lowBiasArticles}%</p>
          <p className="cardz-subtext">Of total articles</p>
        </div>
      </div>

      <div className="bias-section">
        <h3>🕒 Bias Distribution</h3>

        <div className="bar-row">
          <div className="bar-label">
            <span>Low Bias</span>
            <span>{lowBiasArticles}%</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill blue" style={{ width: `${lowBiasArticles}%` }}></div>
          </div>
        </div>

        <div className="bar-row">
          <div className="bar-label">
            <span>Moderate Bias</span>
            <span>{moderateBias}%</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill orange-fill" style={{ width: `${moderateBias}%` }}></div>
          </div>
        </div>

        <div className="bar-row">
          <div className="bar-label">
            <span>High Bias</span>
            <span>{highBias}%</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill red-fill" style={{ width: `${highBias}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;