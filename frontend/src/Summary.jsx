import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
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
  const [ttsState, setTtsState] = useState('stopped');

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

  // Text-to-Speech functions
  const speakSummary = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in this browser');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const text = `${summary.headline}. ${summary.summary}. Key points: ${summary.keyPoints.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setTtsState('playing');
    utterance.onend = () => setTtsState('stopped');
    utterance.onpause = () => setTtsState('paused');
    utterance.onresume = () => setTtsState('playing');
    utterance.onerror = () => setTtsState('stopped');

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
    setTtsState('stopped');
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
                <div className="summary-header-with-tts">
                  <h4>AI Summary</h4>
                  <button 
                    className={`tts-summary-button ${ttsState}`}
                    onClick={() => {
                      if (ttsState === 'playing') {
                        pauseSpeech();
                      } else if (ttsState === 'paused') {
                        resumeSpeech();
                      } else {
                        speakSummary();
                      }
                    }}
                    title="Listen to summary"
                  >
                    {ttsState === 'playing' ? (
                      <Pause size={16} />
                    ) : ttsState === 'paused' ? (
                      <Play size={16} />
                    ) : (
                      <Volume2 size={16} />
                    )}
                  </button>
                  {ttsState !== 'stopped' && (
                    <button 
                      className="tts-summary-stop-button"
                      onClick={stopSpeech}
                      title="Stop listening"
                    >
                      <VolumeX size={16} />
                    </button>
                  )}
                </div>
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