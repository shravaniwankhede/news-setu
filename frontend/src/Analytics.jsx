import React, { useState, useEffect } from "react";
import { useTheme } from "./context/ThemeContext.jsx";
import apiService from "./services/api.js";
import "./styles/Analytics.css";

const Analytics = ({ onPageChange }) => {
  const { theme } = useTheme();
  const [analytics, setAnalytics] = useState({
    totalArticles: 0,
    averagePoliticalBias: 0,
    averageEmotionalBias: 0,
    biasDistribution: { low: 0, moderate: 0, high: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAnalytics();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to fetch analytics. Using sample data.');
      // Use sample data as fallback
      setAnalytics({
        totalArticles: 1247,
        averagePoliticalBias: 34,
        averageEmotionalBias: 41,
        biasDistribution: { low: 42, moderate: 35, high: 23 }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Auto-refresh analytics every 30 seconds
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

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
        {loading && <p>Loading analytics...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <div className="analytics-cards">
          <div className="analytics-card">
            <div className="card-header">
              <h3>Total Articles</h3>
            </div>
            <div className="card-value">{analytics.totalArticles}</div>
            <div className="card-subtitle">Analyzed today</div>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h3>Avg Political Bias</h3>
            </div>
            <div className="card-value orange">{analytics.averagePoliticalBias}%</div>
            <div className="card-subtitle">↓ Lower than yesterday</div>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h3>Avg Emotional Bias</h3>
            </div>
            <div className="card-value red">{analytics.averageEmotionalBias}%</div>
            <div className="card-subtitle">↑ Higher than yesterday</div>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h3>Low Bias Articles</h3>
            </div>
            <div className="card-value green">{analytics.biasDistribution.low}%</div>
            <div className="card-subtitle">Of total articles</div>
          </div>
        </div>

        <div className="bias-distribution">
          <h3 className="section-title">🕒 Bias Distribution</h3>

          <div className="distribution-bars">
            <div className="bar-item">
              <div className="bar-label">
                <span>Low Bias</span>
                <span>{analytics.biasDistribution.low}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill blue" style={{ width: `${analytics.biasDistribution.low}%` }}></div>
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-label">
                <span>Moderate Bias</span>
                <span>{analytics.biasDistribution.moderate}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill orange-fill" style={{ width: `${analytics.biasDistribution.moderate}%` }}></div>
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-label">
                <span>High Bias</span>
                <span>{analytics.biasDistribution.high}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill red-fill" style={{ width: `${analytics.biasDistribution.high}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;