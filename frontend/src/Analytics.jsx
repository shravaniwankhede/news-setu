import React, { useState, useEffect } from "react";
import { useTheme } from "./context/ThemeContext.jsx";
import apiService from "./services/api.js";
import "./styles/Analytics.css";

// ── Skeleton Card ──────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="analytics-card skeleton-card">
    <div className="skeleton skeleton-label" />
    <div className="skeleton skeleton-value" />
    <div className="skeleton skeleton-sub" />
  </div>
);

// ── Skeleton Chart Row ─────────────────────────────────────────────────────────
const SkeletonChart = () => (
  <div className="charts-row">
    <div className="chart-card skeleton-card">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-chart-circle" />
    </div>
    <div className="chart-card skeleton-card">
      <div className="skeleton skeleton-title" />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ marginBottom: "1.2rem" }}>
          <div className="skeleton skeleton-bar-label" />
          <div className="skeleton skeleton-bar-track" />
        </div>
      ))}
    </div>
  </div>
);

// ── Mini Pie Chart (pure SVG) ──────────────────────────────────────────────────
const PieChart = ({ data }) => {
const [tooltip, setTooltip] = useState(null);
const size = 220;
const cx = size / 2;
const cy = size / 2;
const r = 80;
const innerR = 52;

const segments = [
{ label: "Low", value: data.low, color: "#22c55e" },
{ label: "Moderate", value: data.moderate, color: "#f59e0b" },
{ label: "High", value: data.high, color: "#ef4444" },
];

const total = segments.reduce((s, d) => s + d.value, 0) || 1;
let startAngle = -Math.PI / 2;

const arcs = segments.map((seg) => {
const angle = (seg.value / total) * 2 * Math.PI;
const x1 = cx + r * Math.cos(startAngle);
const y1 = cy + r * Math.sin(startAngle);
const endAngle = startAngle + angle;
const x2 = cx + r * Math.cos(endAngle);
const y2 = cy + r * Math.sin(endAngle);
const ix1 = cx + innerR * Math.cos(endAngle);
const iy1 = cy + innerR * Math.sin(endAngle);
const ix2 = cx + innerR * Math.cos(startAngle);
const iy2 = cy + innerR * Math.sin(startAngle);
const large = angle > Math.PI ? 1 : 0;
const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2} Z`;
startAngle = endAngle;
return { ...seg, d };
});

// FIX: persistent selection (click-based)
const active = tooltip ?? { value: data.low, label: "Low Bias" };

return ( <div className="pie-wrapper"> <div className="pie-svg-container">
<svg viewBox={`0 0 ${size} ${size}`} className="pie-svg">
{arcs.map((arc, i) => (
<path
key={i}
d={arc.d}
fill={arc.color}
className={`pie-slice ${tooltip?.label === arc.label ? "pie-slice-active" : ""}`}
style={{ animationDelay: `${i * 0.15}s` }}
onClick={() => setTooltip(arc)}
/>
))}
<text x={cx} y={cy - 10} textAnchor="middle" className="pie-center-val">
{active.value}% </text>
<text x={cx} y={cy + 14} textAnchor="middle" className="pie-center-label">
{active.label} </text> </svg>


    {tooltip && (
      <div className="pie-tooltip">
        <span className="pie-tooltip-dot" style={{ background: tooltip.color }} />
        {tooltip.label} Bias: <strong>{tooltip.value}%</strong>
      </div>
    )}
  </div>

  <div className="pie-legend">
    <p className="chart-subtext">Click slices to inspect</p>
    {arcs.map((arc) => (
      <div key={arc.label} className="legend-item">
        <span className="legend-dot" style={{ background: arc.color }} />
        <span className="legend-text">{arc.label}</span>
        <span className="legend-val">{arc.value}%</span>
      </div>
    ))}
  </div>
</div>

);
};


// ── Animated Bar ───────────────────────────────────────────────────────────────
const AnimatedBar = ({ value, colorClass, delay = 0 }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 200 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className="bar-track">
      <div className={`bar-fill ${colorClass}`} style={{ width: `${width}%` }} />
    </div>
  );
};

// ── Trend Badge ────────────────────────────────────────────────────────────────
const TrendBadge = ({ value, inverse = false }) => {
  const up = value >= 0;
  const good = inverse ? !up : up;
  return (
    <span className={`trend-badge ${good ? "trend-good" : "trend-bad"}`}>
      {up ? "↑" : "↓"} {Math.abs(value)}% vs yesterday
    </span>
  );
};

// ── Stat Card ──────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, colorClass, trend, inverseGood, delay }) => (
  <div className="analytics-card" style={{ animationDelay: `${delay}s` }}>
    <div className="card-icon-row">
      <span className="card-icon">{icon}</span>
      <span className="card-label">{label}</span>
    </div>
    <div className={`card-value ${colorClass}`}>{value}</div>
    {trend !== undefined && <TrendBadge value={trend} inverse={inverseGood} />}
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const Analytics = ({ onPageChange }) => {
  const { theme } = useTheme();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const data = await apiService.getAnalytics();
      setAnalytics(data);
      setError(null);
    } catch {
      setError("Using sample data — API unavailable.");
      setAnalytics({
        totalArticles: 1247,
        averagePoliticalBias: 34,
        averageEmotionalBias: 41,
        biasDistribution: { low: 42, moderate: 35, high: 23 },
        trends: { articles: 12, political: -3, emotional: 5 },
      });
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
      setFadeIn(false);
      requestAnimationFrame(() => setFadeIn(true));
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const trends = analytics?.trends ?? { articles: 12, political: -3, emotional: 5 };

  const getInsight = () => {
    if (!analytics) return "";
    const { averageEmotionalBias, averagePoliticalBias } = analytics;
    if (averageEmotionalBias > 50)
      return "⚡ High emotional tone detected — media language is notably charged today.";
    if (averagePoliticalBias > 50)
      return "🏛️ Political framing is elevated — consider cross-referencing multiple sources.";
    return "✅ Today's coverage shows relatively balanced reporting across analysed sources.";
  };

  return (
    <div className="analytics-container" data-theme={theme}>

      {/* ── Header ── */}
      <div className="analytics-header">
        <button className="back-btn" onClick={() => onPageChange("landing")}>
          ← Back
        </button>
        <h1 className="analytics-title">📊 Analytics Dashboard</h1>
        {lastUpdated && (
          <span className="last-updated">
            🕐 {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>

      {/* ── Error Banner ── */}
      {error && <div className="error-banner">⚠️ {error}</div>}

      <div className={`analytics-content ${fadeIn ? "fade-in" : ""}`}>

        {/* ── Stat Cards ── */}
        <div className="analytics-cards">
          {loading ? (
            [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
          ) : (
            <>
              {/* Neutral color for aggregate metrics — not bias-category colors */}
              <StatCard
                icon="📰" label="Total Articles"
                value={analytics.totalArticles.toLocaleString()}
                colorClass="neutral"
                trend={trends.articles}
                delay={0}
              />
              <StatCard
                icon="🏛️" label="Avg Political Bias"
                value={`${analytics.averagePoliticalBias}%`}
                colorClass="blue"
                trend={trends.political}
                inverseGood delay={0.08}
              />
              <StatCard
                icon="💬" label="Avg Emotional Bias"
                value={`${analytics.averageEmotionalBias}%`}
                colorClass="blue"
                trend={trends.emotional}
                inverseGood delay={0.16}
              />
              {/* Green IS correct here — this card IS the low-bias category */}
              <StatCard
                icon="✅" label="Low Bias Articles"
                value={`${analytics.biasDistribution.low}%`}
                colorClass="green"
                trend={undefined}
                delay={0.24}
              />
            </>
          )}
        </div>

        {/* ── Charts Row ── */}
        {loading ? <SkeletonChart /> : analytics && (
          <div className="charts-row">
            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="section-title">🥧 Bias Distribution</h3>
                <span className="chart-subheading">Visual summary</span>
              </div>
              <PieChart data={analytics.biasDistribution} />
            </div>

            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="section-title">📊 Detailed Breakdown</h3>
                <span className="chart-subheading">Percentage by category</span>
              </div>
              <div className="distribution-bars">
                {[
                  { label: "Low Bias",      value: analytics.biasDistribution.low,      cls: "green-fill",  delay: 0   },
                  { label: "Moderate Bias", value: analytics.biasDistribution.moderate,  cls: "orange-fill", delay: 100 },
                  { label: "High Bias",     value: analytics.biasDistribution.high,      cls: "red-fill",    delay: 200 },
                ].map(({ label, value, cls, delay }) => (
                  <div key={label} className="bar-item">
                    <div className="bar-label">
                      <span>{label}</span>
                      <span className="bar-pct">{value}%</span>
                    </div>
                    <AnimatedBar value={value} colorClass={cls} delay={delay} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── AI Insight ── */}
        {!loading && analytics && (
          <div className="insight-card">
            <span className="insight-icon">🤖</span>
            <div>
              <div className="insight-heading">Today's Insight</div>
              <div className="insight-text">{getInsight()}</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Analytics;