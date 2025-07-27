import React from 'react';
import axios from 'axios';

const ArticleCard = ({ article }) => {
  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5000/api/articles/save', article);
      alert("Article saved!");
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Failed to save article.");
    }
  };

  return (
    <div className="article-card">
      <h3>{article.title}</h3>
      <p>{article.description}</p>
      <a href={article.url} target="_blank" rel="noreferrer">Read Full Article</a>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ArticleCard;
