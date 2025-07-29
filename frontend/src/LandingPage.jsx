import React, { useState, useEffect } from "react";
import { Clock, Calendar, Languages, Volume2, VolumeX, Play, Pause } from "lucide-react";
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
    saved: false
  },
  {
    id: 6,
    title: "Major Sports League Announces Revolutionary Rule Changes",
    description: "In a bold move to increase game excitement and viewer engagement, the league has announced sweeping rule changes that will fundamentally alter how the sport is played. The new rules include extended play periods, modified scoring systems, and enhanced player safety protocols. Fans and analysts are divided on whether these changes will improve the game or disrupt its traditional appeal. The changes will be implemented starting next season.",
    image: "https://i.pinimg.com/1200x/7e/1b/92/7e1b92c1c4c4c4c4c4c4c4c4c4c4c4c4.jpg",
    category: "Sports",
    publishDate: "2024-01-19",
    readTime: "6 min read",
    politicalBias: "Moderate",
    emotionalBias: "Controversial",
    saved: false
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
    saved: false
  },
  {
    id: 8,
    title: "Global Food Security Initiative Launches in Developing Nations",
    description: "A comprehensive food security program has been launched across multiple developing nations, aiming to address hunger and malnutrition through sustainable agricultural practices. The initiative combines traditional farming methods with modern technology, including drought-resistant crops and efficient irrigation systems. Local communities are being trained in sustainable farming techniques, while international organizations provide funding and technical support. Early results show promising improvements in crop yields and food availability.",
    image: "https://i.pinimg.com/1200x/5c/fd/74/5cfd74c1c4c4c4c4c4c4c4c4c4c4c4c4.jpg",
    category: "World",
    publishDate: "2024-01-17",
    readTime: "7 min read",
    politicalBias: "Low",
    emotionalBias: "Hopeful",
    saved: false
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
    saved: false
  },
  {
    id: 10,
    title: "Major Tech Company Announces Revolutionary AI Assistant",
    description: "A leading technology company has unveiled its most advanced artificial intelligence assistant yet, capable of understanding context, learning user preferences, and performing complex tasks with minimal human intervention. The AI system integrates seamlessly with smart home devices, productivity tools, and entertainment platforms. Privacy advocates have raised concerns about data collection, while tech enthusiasts praise the innovation. The assistant will be available to consumers next month.",
    image: "https://i.pinimg.com/1200x/3a/df/56/3adf56c1c4c4c4c4c4c4c4c4c4c4c4c4.jpg",
    category: "Technology",
    publishDate: "2024-01-15",
    readTime: "6 min read",
    politicalBias: "Moderate",
    emotionalBias: "Exciting",
    saved: false
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
    saved: false
  },
  {
    id: 12,
    title: "Revolutionary Renewable Energy Storage Solution",
    description: "Engineers have developed an innovative energy storage system that could solve the intermittency problem of renewable energy sources. The new technology uses advanced materials and smart grid integration to store excess energy during peak production and release it during high demand periods. This breakthrough could accelerate the transition to clean energy by making solar and wind power more reliable and cost-effective. Utility companies worldwide are showing interest in implementing this technology.",
    image: "https://i.pinimg.com/1200x/18/c1/38/18c138c1c4c4c4c4c4c4c4c4c4c4c4c4.jpg",
    category: "Environment",
    publishDate: "2024-01-13",
    readTime: "8 min read",
    politicalBias: "Low",
    emotionalBias: "Optimistic",
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
  const [selectedArticleForSummary, setSelectedArticleForSummary] = useState(null);
  const [ttsStates, setTtsStates] = useState({});
  const [speechUtterance, setSpeechUtterance] = useState(null);

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



  const translateArticle = async (article) => {
    try {
      setTranslating(prev => ({ ...prev, [article.id]: true }));
      
      // Translate title and description separately for better accuracy
      const titleResponse = await apiService.translateText(article.title, selectedLanguage);
      const descriptionResponse = await apiService.translateText(article.description, selectedLanguage);
      
      // Validate responses
      if (!titleResponse.translatedText || !descriptionResponse.translatedText) {
        throw new Error('Invalid translation response');
      }
      
      setTranslations(prev => ({
        ...prev,
        [article.id]: {
          title: titleResponse.translatedText,
          description: descriptionResponse.translatedText,
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

  const handleSummaryClick = (article) => {
    onPageChange('summary', article);
  };

  // Text-to-Speech functions
  const speakArticle = (article) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in this browser');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const text = `${article.title}. ${article.description}`;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set default properties
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setTtsStates(prev => ({ ...prev, [article.id]: 'playing' }));
    };

    utterance.onend = () => {
      setTtsStates(prev => ({ ...prev, [article.id]: 'stopped' }));
    };

    utterance.onpause = () => {
      setTtsStates(prev => ({ ...prev, [article.id]: 'paused' }));
    };

    utterance.onresume = () => {
      setTtsStates(prev => ({ ...prev, [article.id]: 'playing' }));
    };

    utterance.onerror = () => {
      setTtsStates(prev => ({ ...prev, [article.id]: 'stopped' }));
    };

    setSpeechUtterance(utterance);
    window.speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => {
    window.speechSynthesis.pause();
  };

  const resumeSpeech = () => {
    window.speechSynthesis.resume();
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setTtsStates({});
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
                <button className="summarize" onClick={() => handleSummaryClick(article)}>✓ Summarize</button>
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
                <div className="card-tts-controls">
                  <button 
                    className={`tts-card-button ${ttsStates[article.id] || 'stopped'}`}
                    onClick={() => {
                      const currentState = ttsStates[article.id];
                      if (currentState === 'playing') {
                        pauseSpeech();
                      } else if (currentState === 'paused') {
                        resumeSpeech();
                      } else {
                        speakArticle(article);
                      }
                    }}
                    title="Listen to article"
                  >
                    <div className="tts-button-content">
                      <div className="tts-icon">
                        {ttsStates[article.id] === 'playing' ? (
                          <Pause size={16} />
                        ) : ttsStates[article.id] === 'paused' ? (
                          <Play size={16} />
                        ) : (
                          <Volume2 size={16} />
                        )}
                      </div>
                      <span className="tts-label">
                        {ttsStates[article.id] === 'playing' ? 'Pause' : 
                         ttsStates[article.id] === 'paused' ? 'Resume' : 'Listen'}
                      </span>
                    </div>
                  </button>
                  {(ttsStates[article.id] === 'playing' || ttsStates[article.id] === 'paused') && (
                    <button 
                      className="tts-card-stop-button"
                      onClick={stopSpeech}
                      title="Stop listening"
                    >
                      <VolumeX size={16} />
                    </button>
                  )}
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