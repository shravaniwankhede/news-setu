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
    <div className="analytics-container">
      <div className="analytics-header">
        <button className="back-btn" onClick={handleClose}>
          ← Back to News
        </button>
        <h1 className="analytics-title">📊 Analytics Dashboard</h1>
      </div>

      <div className="analytics-content">
        <div className="analytics-cards">
          <div className="analytics-card">
            <div className="card-header">
              <h3>Total Articles</h3>
            </div>
            <div className="card-value">{totalArticles}</div>
            <div className="card-subtitle">Analyzed today</div>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h3>Avg Political Bias</h3>
            </div>
            <div className="card-value orange">{avgPoliticalBias}%</div>
            <div className="card-subtitle">↓ Lower than yesterday</div>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h3>Avg Emotional Bias</h3>
            </div>
            <div className="card-value red">{avgEmotionalBias}%</div>
            <div className="card-subtitle">↑ Higher than yesterday</div>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h3>Low Bias Articles</h3>
            </div>
            <div className="card-value green">{lowBiasArticles}%</div>
            <div className="card-subtitle">Of total articles</div>
          </div>
        </div>

        <div className="bias-distribution">
          <h3 className="section-title">🕒 Bias Distribution</h3>

          <div className="distribution-bars">
            <div className="bar-item">
              <div className="bar-label">
                <span>Low Bias</span>
                <span>{lowBiasArticles}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill blue" style={{ width: `${lowBiasArticles}%` }}></div>
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-label">
                <span>Moderate Bias</span>
                <span>{moderateBias}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill orange-fill" style={{ width: `${moderateBias}%` }}></div>
              </div>
            </div>

            <div className="bar-item">
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
      </div>
    </div>
  );
};

export default Analytics;