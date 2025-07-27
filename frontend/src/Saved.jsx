// Saved.jsx
import React, { useState } from "react";
import "./styles/Saved.css";
import { Clock, Calendar } from "lucide-react";

const Saved = () => {
  const [articles, setArticles] = useState([
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
  ]);

  const handleToggleSave = (id) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id ? { ...article, saved: !article.saved } : article
      )
    );
  };

  const savedArticles = articles.filter((article) => article.saved);

  return (
    <div className="saved-page">
      <h2>🔖 Your Saved Articles</h2>

      {savedArticles.length === 0 ? (
        <p className="empty-msg">No articles saved yet.</p>
      ) : (
        <div className="saved-list">
          {savedArticles.map((article) => (
            <div className="saved-card" key={article.id}>
              <img
                src={article.image}
                alt={article.title}
                className="saved-image"
              />
              <div className="saved-content">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <div className="metaa">
                  <span>{article.category}</span>
                  <span>
                    <Clock size={12} /> {article.readTime}
                  </span>
                  <span>
                    <Calendar size={12} /> {article.publishDate}
                  </span>
                </div>
                <button
                  className="unsave-btn"
                  onClick={() => handleToggleSave(article.id)}
                >
                  Remove 
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
