import React from "react";
import "../styles/Analytics.css";

const Analytics = () => {
  const totalArticles = 1247;
  const avgPoliticalBias = 34;
  const avgEmotionalBias = 41;
  const lowBiasArticles = 42;
  const moderateBias = 35;
  const highBias = 23;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <button className="close-btn">✕ Close</button>
      </div>

      <h2 className="dashboard-subtitle">📊 Bias Analytics Overview</h2>

      <div className="cards-grid">
        <div className="card">
          <p className="card-title">Total Articles</p>
          <p className="card-value">{totalArticles}</p>
          <p className="card-subtext">Analyzed today</p>
        </div>

        <div className="card">
          <p className="card-title">Avg Political Bias</p>
          <p className="card-value orange">{avgPoliticalBias}%</p>
          <p className="card-subtext">↓ Lower than yesterday</p>
        </div>

        <div className="card">
          <p className="card-title">Avg Emotional Bias</p>
          <p className="card-value red">{avgEmotionalBias}%</p>
          <p className="card-subtext">↑ Higher than yesterday</p>
        </div>

        <div className="card">
          <p className="card-title">Low Bias Articles</p>
          <p className="card-value green">{lowBiasArticles}%</p>
          <p className="card-subtext">Of total articles</p>
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