import React from 'react';
import './styles/About.css';

const About = ({ onPageChange }) => {
  return (
    <div className="about-container">
      <div className="about-header">
        <button className="back-btn" onClick={() => onPageChange('landing')}>
          ← Back to News
        </button>
        <h1 className="about-title">📰 About NewsSetu</h1>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h2 className="section-title">🎯 Our Mission</h2>
          <p className="about-text">
            NewsSetu is a revolutionary news aggregation platform designed to provide users with unbiased, 
            comprehensive news coverage while offering advanced bias analysis and AI-powered insights. 
            Our mission is to bridge the gap between information and understanding, helping users make 
            informed decisions in today's complex media landscape.
          </p>
        </div>

        <div className="about-section">
          <h2 className="section-title">🚀 Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search & Filtering</h3>
              <p>Advanced search functionality with category and bias level filtering to find exactly what you're looking for.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚖️</div>
              <h3>Bias Analysis</h3>
              <p>AI-powered political and emotional bias detection to help you understand different perspectives.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics Dashboard</h3>
              <p>Comprehensive analytics showing bias distribution and trends across news articles.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎤</div>
              <h3>Text-to-Speech</h3>
              <p>Listen to articles with our integrated text-to-speech feature for hands-free reading.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>AI Summaries</h3>
              <p>Get instant AI-generated summaries of articles to quickly grasp key points.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌙</div>
              <h3>Dark/Light Theme</h3>
              <p>Comfortable reading experience with customizable light and dark themes.</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2 className="section-title">🛠️ Technology Stack</h2>
          <div className="tech-stack">
            <div className="tech-category">
              <h3>Frontend</h3>
              <ul>
                <li>React.js - Modern UI framework</li>
                <li>Vite - Fast build tool</li>
                <li>CSS3 - Styling and animations</li>
                <li>Lucide React - Icon library</li>
              </ul>
            </div>
            
            <div className="tech-category">
              <h3>Backend</h3>
              <ul>
                <li>Node.js - Server runtime</li>
                <li>Express.js - Web framework</li>
                <li>MongoDB - Database</li>
                <li>OpenAI API - AI integration</li>
              </ul>
            </div>
            
            <div className="tech-category">
              <h3>AI & Analysis</h3>
              <ul>
                <li>OpenAI GPT - Content analysis</li>
                <li>Bias detection algorithms</li>
                <li>Sentiment analysis</li>
                <li>Text summarization</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2 className="section-title">👥 Our Team</h2>
          <p className="about-text">
            NewsSetu is developed by a passionate team of developers, designers, and AI researchers 
            committed to creating a more informed and balanced news consumption experience. Our diverse 
            backgrounds in technology, journalism, and data science enable us to build innovative 
            solutions for modern news challenges.
          </p>
        </div>

        <div className="about-section">
          <h2 className="section-title">🎯 Future Roadmap</h2>
          <div className="roadmap">
            <div className="roadmap-item">
              <div className="roadmap-icon">🔮</div>
              <div className="roadmap-content">
                <h3>Phase 1: Enhanced AI</h3>
                <p>Improved bias detection algorithms and more accurate sentiment analysis</p>
              </div>
            </div>
            
            <div className="roadmap-item">
              <div className="roadmap-icon">🌍</div>
              <div className="roadmap-content">
                <h3>Phase 2: Global Expansion</h3>
                <p>Multi-language support and international news sources</p>
              </div>
            </div>
            
            <div className="roadmap-item">
              <div className="roadmap-icon">📱</div>
              <div className="roadmap-content">
                <h3>Phase 3: Mobile App</h3>
                <p>Native mobile applications for iOS and Android</p>
              </div>
            </div>
            
            <div className="roadmap-item">
              <div className="roadmap-icon">🤝</div>
              <div className="roadmap-content">
                <h3>Phase 4: Community Features</h3>
                <p>User discussions, article sharing, and community moderation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 