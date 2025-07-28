import React, { useState, useEffect } from 'react';
import apiService from './services/api.js';
import './styles/Summary.css';

const Summary = ({ onPageChange, selectedArticle }) => {
  const [summary, setSummary] = useState({
    source: 'Reuters',
    date: 'January 15, 2024 at 04:00 PM',
    headline: 'Global Climate Summit Reaches Historic Agreement on Carbon Reduction Targets Which Is A Great News.',
    image: 'https://i.pinimg.com/736x/4c/e7/57/4ce757e37b91088187ca383c0e495302.jpg',
    keyPoints: [
      '195 countries agree to reduce carbon emissions by 45% before 2030',
      'New $100 billion climate fund established for developing nations',
      'Renewable energy targets set at 70% of global energy mix by 2035',
      'Binding enforcement mechanisms included for the first time',
      'Major oil companies commit to carbon neutrality by 2050'
    ],
    summary: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedArticle) {
      generateSummary();
    }
  }, [selectedArticle]);

  const generateSummary = async () => {
    if (!selectedArticle) return;
    
    try {
      setLoading(true);
      const articleText = `${selectedArticle.title}. ${selectedArticle.description}`;
      
      const response = await apiService.generateSummary(articleText, selectedArticle.title);
      setSummary(prev => ({
        ...prev,
        source: selectedArticle.source || 'News Source',
        date: selectedArticle.publishedAt || 'Recent',
        headline: selectedArticle.title,
        image: selectedArticle.image,
        summary: response.summary,
        keyPoints: response.keyPoints || [
          'Key development in the field',
          'Significant impact on industry',
          'Future implications discussed',
          'Expert opinions included',
          'Data and statistics presented'
        ]
      }));
    } catch (err) {
      console.error('Error generating summary:', err);
      // Keep existing summary on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summary-container">
      <div className="summary-header">
        <button className="back-btn" onClick={() => onPageChange('landing')}>
          ← Back to News
        </button>
        <h1 className="logo">NewsSetu</h1>
      </div>

      <div className="summary-box">
        <div className="source-date">
          <span className="source">{summary.source}</span>
          <span className="bullet">•</span>
          <span className="date">{summary.date}</span>
        </div>

        <h2 className="headline">
          "{summary.headline}"
        </h2>

        <div className="image-and-points">
          <img
            className="summary-image"
            src={summary.image}
            alt="News"
          />

          <div className="key-points">
            <h3>Key Points</h3>
            <ul>
              {summary.keyPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>

            {loading && <p>Generating summary...</p>}
            {summary.summary && (
              <div className="summary-text">
                <h4>AI Summary</h4>
                <p>{summary.summary}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;