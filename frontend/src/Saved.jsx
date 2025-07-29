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
        },
        {
          id: 5,
          title: "New Electric Vehicle Battery Technology Achieves 500-Mile Range",
          description: "Scientists have developed a revolutionary battery technology that enables electric vehicles to travel up to 500 miles on a single charge. This breakthrough addresses one of the biggest concerns about EV adoption - range anxiety. The new battery technology uses advanced lithium-ion chemistry with improved energy density and faster charging capabilities. Major automakers are already in talks to license this technology for their upcoming electric vehicle models.",
          image: "https://i.pinimg.com/1200x/8f/2a/85/8f2a85c1c4c4c4c4c4c4c4c4c4c4c4c4.jpg",
          category: "Technology",
          publishDate: "2024-01-20",
          readTime: "8 min read",
          politicalBias: "Low",
          emotionalBias: "Exciting",
          saved: true
        },
        {
          id: 7,
          title: "Breakthrough in Quantum Computing Research",
          description: "Researchers have achieved a significant milestone in quantum computing by successfully maintaining quantum coherence for unprecedented periods. This development brings us closer to practical quantum computers that could solve complex problems impossible for classical computers. The breakthrough involves new error correction techniques and improved qubit stability. Industry experts predict this could accelerate drug discovery, cryptography, and artificial intelligence applications.",
          image: "https://i.pinimg.com/1200x/6d/0c/83/6d0c83c1c4c4c4c4c4c4c4c4c4c4c4c4.jpg",
          category: "Science",
          publishDate: "2024-01-18",
          readTime: "9 min read",
          politicalBias: "Low",
          emotionalBias: "Fascinating",
          saved: true
        },
        {
          id: 9,
          title: "Revolutionary Cancer Treatment Shows Promising Results",
          description: "A new immunotherapy treatment has demonstrated remarkable success in clinical trials, with patients showing significant improvement in various types of cancer. The treatment works by harnessing the body's own immune system to target and destroy cancer cells more effectively than traditional methods. Doctors report fewer side effects and better quality of life for patients undergoing this treatment. The FDA has granted fast-track approval for further testing.",
          image: "https://i.pinimg.com/1200x/4b/ee/65/4bee65c1c4c4c4c4c4c4c4c4c4c4c4c4.jpg",
          category: "Health",
          publishDate: "2024-01-16",
          readTime: "8 min read",
          politicalBias: "Low",
          emotionalBias: "Hopeful",
          saved: true
        },
        {
          id: 11,
          title: "Historic Peace Agreement Signed Between Rival Nations",
          description: "After decades of conflict and tension, two neighboring nations have signed a historic peace agreement that promises to end hostilities and establish diplomatic relations. The agreement includes economic cooperation, cultural exchange programs, and joint infrastructure projects. International mediators played a crucial role in facilitating the negotiations. Citizens from both countries have expressed hope for a brighter future of cooperation and mutual understanding.",
          image: "https://i.pinimg.com/1200x/29/d0/47/29d047c1c4c4c4c4c4c4c4c4c4c4c4c4.jpg",
          category: "World",
          publishDate: "2024-01-14",
          readTime: "7 min read",
          politicalBias: "Low",
          emotionalBias: "Hopeful",
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
