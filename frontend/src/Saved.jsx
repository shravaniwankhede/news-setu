// Saved.jsx
import React, { useState, useEffect } from "react";
import "./styles/Saved.css";
import { Clock, Calendar, Bookmark } from "lucide-react";
import apiService from "./services/api.js";

const Saved = ({ onPageChange }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSavedArticles();
  }, []);

  const fetchSavedArticles = async () => {
    try {
      setLoading(true);
      const savedArticles = await apiService.getArticlesByUser('anonymous');
      setArticles(savedArticles);
      setError(null);
    } catch (err) {
      console.error('Error fetching saved articles:', err);
      setError('Failed to fetch saved articles. Using sample data.');
      // Use sample data as fallback
      setArticles([
        {
          id: 3,
          title: "Economic Markets Are Now Showing Strong Recovery Signs",
          description: "Global financial markets are showing clear signs of recovery, with major stock indices rising, investor confidence improving, and economic indicators pointing toward sustained growth following a period of volatility.The economic market shows strong recovery, with growth indicators trending upward. Consumer spending and employment rates are also improving steadily.",
          image: "https://i.pinimg.com/1200x/38/d4/d7/38d4d70886c8a2dd73f3e5f1497c8f73.jpg",
          category: "Business",
          publishDate: "2024-01-22",
          readTime: "4 min read",
          politicalBias: "High",
          emotionalBias: "Optimistic", 
          saved: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (id) => {
    try {
      await apiService.deleteArticle(id);
      setArticles((prev) => prev.filter((article) => article.id !== id));
    } catch (err) {
      console.error('Error removing saved article:', err);
      // Still remove from UI for better UX
      setArticles((prev) => prev.filter((article) => article.id !== id));
    }
  };

  const savedArticles = articles.filter((article) => article.saved);

  return (
    <div className="saved-container">
      <div className="saved-header">
        <button className="back-btn" onClick={() => onPageChange('landing')}>
          ← Back to News
        </button>
        <h1 className="saved-title">🔖 Your Saved Articles</h1>
      </div>

      {loading && <p>Loading saved articles...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {!loading && !error && savedArticles.length === 0 ? (
        <p className="empty-msg">No articles saved yet.</p>
      ) : (
        <div className="saved-list">
          {savedArticles.map((article) => (
            <div className="saved-card" key={article.id}>
              <div className="image-container">
                <img
                  src={article.image}
                  alt={article.title}
                  className="saved-image"
                />
                <button className="save-button" onClick={() => handleToggleSave(article.id)}>
                  <Bookmark className="icon saved" />
                </button>
              </div>
              <div className="saved-content">
                <div className="meta">
                  <span className="category">{article.category}</span>
                  <span><Clock size={10} /> {article.readTime}</span>
                  <span><Calendar size={10} /> {article.publishDate}</span>
                </div>
                <h3 className="title">{article.title}</h3>
                <p className="description">{article.description}</p>
                <div className="bias">
                  <span className="badge bias-high">Political: {article.politicalBias}</span>
                  <span className="badge bias-positive">Emotional: {article.emotionalBias}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
