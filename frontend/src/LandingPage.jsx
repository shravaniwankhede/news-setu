import React, { useState, useEffect } from "react";
import { Bookmark, Clock, Calendar, Languages } from "lucide-react";
import { useTheme } from "./context/ThemeContext.jsx";
import apiService from "./services/api.js";
import './styles/Landingpage.css';

const LandingPageData = [
  {
    id: 1,
    title: "Revolutionary AI Technology Transforms Healthcare Industry",
    description: "A groundbreaking artificial intelligence system is making waves in the healthcare sector, enabling faster diagnoses, personalized treatment plans, and improved patient outcomes. Experts believe this innovation could significantly reduce human error and revolutionize how hospitals manage patient care. The technology is already being piloted in major hospitals worldwide, marking a major leap toward the future of medicine.",
    image: "https://i.pinimg.com/1200x/9a/14/b8/9a14b84bb2cc2f5405f4c3676a77aec6.jpg",
    category: "Technology",
    publishDate: "2024-01-24",
    readTime: "5 min read",
    politicalBias: "Moderate",
    emotionalBias: "Positive",
    saved: false
  },
  {
    id: 2,
    title: "Global Climate Summit Reaches Historic Agreement",
    description: "In a landmark moment for global environmental policy, world leaders have come together at the Climate Summit to sign a historic agreement aimed at drastically reducing carbon emissions and accelerating the shift to renewable energy. The pact sets ambitious targets for 2030 and includes financial commitments to support developing nations in their climate resilience efforts. Environmental groups are calling it a turning point in the fight against climate change.",
    image: "https://i.pinimg.com/736x/5b/a4/66/5ba46665fc9bdb09ff6546654cc75e4d.jpg",
    category: "Environment",
    publishDate: "2024-01-23",
    readTime: "7 min read",
    politicalBias: "Low",
    emotionalBias: "Hopeful",
    saved: false
  },
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
    id: 4,
    title: "Breakthrough in Space Exploration Technology",
    description: "A major advancement in space exploration technology is set to revolutionize future missions, with new innovations enhancing spacecraft efficiency, deep-space communication, and the potential for human exploration beyond Earth's orbit.",
    image: "https://i.pinimg.com/1200x/de/35/3c/de353c9f646c31592a03faf7ef15065c.jpg",
    category: "Science",
    publishDate: "2024-01-21",
    readTime: "6 min read",
    politicalBias: "Moderate",
    emotionalBias: "Exciting",
    saved: false
  }
];

const getBiasClass = (bias) => {
  const b = bias.toLowerCase();
  if (b === "low") return "bias-low";
  if (b === "high") return "bias-high";
  if (b === "moderate") return "bias-moderate";
  if (["positive", "hopeful", "optimistic", "exciting"].includes(b)) return "bias-positive";
  return "bias-default";
};

const LandingPage = ({ onPageChange }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBias, setSelectedBias] = useState("all");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translations, setTranslations] = useState({});
  const [translating, setTranslating] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('es');

  // Fetch news on component mount and when search/category changes
  useEffect(() => {
    fetchNews();
  }, [searchQuery, selectedCategory]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await apiService.fetchNews(searchQuery, selectedCategory);
      // Map urlToImage to image for consistency
      const mappedArticles = (response.articles || []).map(article => ({
        ...article,
        image: article.urlToImage || article.image
      }));
      setArticles(mappedArticles);
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news. Using sample data.');
      setArticles(LandingPageData); // Fallback to sample data
    } finally {
      setLoading(false);
    }
  };

  const toggleSaved = async (article) => {
    try {
      if (article.saved) {
        // Delete from saved articles
        await apiService.deleteArticle(article.id);
      } else {
        // Save article
        await apiService.saveArticle({
          ...article,
          userId: 'anonymous' // Default user for now
        });
      }
      
      // Update local state
      setArticles(articles.map((a) => 
        a.id === article.id ? { ...a, saved: !a.saved } : a
      ));
    } catch (err) {
      console.error('Error toggling saved status:', err);
      // Still update UI for better UX
      setArticles(articles.map((a) => 
        a.id === article.id ? { ...a, saved: !a.saved } : a
      ));
    }
  };

  const translateArticle = async (article) => {
    try {
      setTranslating(prev => ({ ...prev, [article.id]: true }));
      
      const textToTranslate = `${article.title}. ${article.description}`;
      const response = await apiService.translateText(textToTranslate, selectedLanguage);
      
      setTranslations(prev => ({
        ...prev,
        [article.id]: {
          title: response.translatedText.split('. ')[0] + '.',
          description: response.translatedText.split('. ').slice(1).join('. '),
          language: selectedLanguage
        }
      }));
    } catch (err) {
      console.error('Error translating article:', err);
      // Show error in UI
      setTranslations(prev => ({
        ...prev,
        [article.id]: {
          title: `[Translation error for ${selectedLanguage}]`,
          description: article.description,
          language: selectedLanguage
        }
      }));
    } finally {
      setTranslating(prev => ({ ...prev, [article.id]: false }));
    }
  };

  const filteredArticles = articles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || a.category.toLowerCase() === selectedCategory;
    const matchesBias = selectedBias === "all" || a.politicalBias.toLowerCase() === selectedBias;
    return matchesSearch && matchesCategory && matchesBias;
  });

  return (
    <div className="landing-page">
      <div className="app">
        <header className="header">
          <input
            type="text"
            className="search"
            placeholder="  Search news articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <span className="dropdown-label">Categories: </span>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="technology">Technology</option>
            <option value="environment">Environment</option>
            <option value="business">Business</option>
            <option value="science">Science</option>
            <option value="politics">Politics</option>
            <option value="world">World</option>
            <option value="local">Local</option>
          </select>
         
          <span className="dropdown-label">Bias Level: </span>
          <select value={selectedBias} onChange={(e) => setSelectedBias(e.target.value)}>
            <option value="all">All Bias Levels</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
            <option value="high">High</option>
          </select>

          <span className="dropdown-label">Translate to: </span>
          <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
            <option value="zh">Chinese</option>
            <option value="ar">Arabic</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
          </select>
        </header>

        <main className="articles">
          {loading && <p>Loading articles...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && filteredArticles.map((article) => (
            <div className="card" key={article.id}>
              <div className="image-container">
                <img src={article.image} alt={article.title} className="image" />
                <button className="save-button" onClick={() => toggleSaved(article)}>
                  <Bookmark className={`icon ${article.saved ? "saved" : ""}`} />
                </button>
                <button className="summarize" onClick={() => onPageChange('summary')}>✓ Summarize</button>
                <button 
                  className="translate-button" 
                  onClick={() => translateArticle(article)}
                  disabled={translating[article.id]}
                >
                  {translating[article.id] ? 'Translating...' : <Languages size={16} />}
                </button>
              </div>
              <div className="content">
                <div className="meta">
                  <span className="category">{article.category}</span>
                  <span><Clock size={10} /> {article.readTime}</span>
                  <span><Calendar size={10} /> {article.publishDate}</span>
                </div>
                <h3 className="title">
                  {translations[article.id] ? translations[article.id].title : article.title}
                </h3>
                <p className="description">
                  {translations[article.id] ? translations[article.id].description : article.description}
                </p>
                {translations[article.id] && (
                  <div className="translation-info">
                    <span className="translation-badge">
                      Translated to {translations[article.id].language.toUpperCase()}
                    </span>
                    <button 
                      className="reset-translation" 
                      onClick={() => setTranslations(prev => {
                        const newTranslations = { ...prev };
                        delete newTranslations[article.id];
                        return newTranslations;
                      })}
                    >
                      Show Original
                    </button>
                  </div>
                )}
                <span className="biasanal">⎋ Bias Analysis</span>
                <div className="bias">
                  <span className={`badge ${getBiasClass(article.politicalBias)}`}>
                    Political: {article.politicalBias}
                  </span>
                  <span className={`badge ${getBiasClass(article.emotionalBias)}`}>
                    Emotional: {article.emotionalBias}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </main>
        <footer className="footer">
         <p>NewsSetu - Your gateway to unbiased news </p>
          <p>© 2025 News App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
  
};

export default LandingPage;