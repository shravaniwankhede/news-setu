import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, Calendar, Trash2 } from 'lucide-react';
import { useTheme } from './context/ThemeContext.jsx';
import './styles/Saved.css';

const getBiasClass = (bias) => {
  if (!bias) return 'bias-default';
  const b = bias.toLowerCase();
  if (b === 'low') return 'bias-low';
  if (b === 'high') return 'bias-high';
  if (b === 'moderate') return 'bias-moderate';
  if (['positive', 'hopeful', 'optimistic', 'exciting'].includes(b)) return 'bias-positive';
  return 'bias-default';
};

const Saved = ({ onPageChange }) => {
  const { theme } = useTheme();
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    setSavedArticles(stored);
  }, []);

  const removeArticle = (id) => {
    const updated = savedArticles.filter(a => a.id !== id);
    setSavedArticles(updated);
    localStorage.setItem('savedArticles', JSON.stringify(updated));
  };

  return (
    <div className="saved-container">
      <div className="saved-header">
        <button className="back-btn" onClick={() => onPageChange('landing')}>← Back to News</button>
        <h1 className="saved-title">🔖 Saved Articles ({savedArticles.length})</h1>
      </div>

      {savedArticles.length === 0 ? (
        <p className="empty-msg">No saved articles yet. Click the bookmark icon on any article to save it here.</p>
      ) : (
        <div className="saved-list">
          {savedArticles.map(article => (
            <div className="saved-card" key={article.id}>
              <div className="image-container">
                <img
                  src={article.image || 'https://placehold.co/250x200?text=No+Image'}
                  alt={article.title}
                  className="saved-image"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/250x200?text=No+Image'; }}
                />
              </div>
              <div className="saved-content">
                <div className="meta">
                  <span className="category">{article.category}</span>
                  {article.readTime && <span><Clock size={10} /> {article.readTime}</span>}
                  {article.publishDate && <span><Calendar size={10} /> {article.publishDate}</span>}
                </div>
                <h3 className="title">{article.title}</h3>
                <p className="description">{article.description}</p>
                <div className="bias">
                  <span className={`badge ${getBiasClass(article.politicalBias)}`}>
                    Political: {article.politicalBias}
                  </span>
                  <span className={`badge ${getBiasClass(article.emotionalBias)}`}>
                    Emotional: {article.emotionalBias}
                  </span>
                </div>
                <button className="remove-btn" onClick={() => removeArticle(article.id)} title="Remove from saved">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
