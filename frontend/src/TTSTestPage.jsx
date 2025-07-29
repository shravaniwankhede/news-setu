import React, { useState } from 'react';
import TextToSpeech from './components/TextToSpeech.jsx';
import './styles/TextToSpeech.css';
import './styles/TTSTestPage.css';

const TTSTestPage = ({ onPageChange }) => {
  const [selectedContent, setSelectedContent] = useState('');

  const sampleContents = [
    {
      id: 1,
      title: "Technology News",
      text: "Revolutionary AI Technology Transforms Healthcare Industry. A groundbreaking artificial intelligence system is making waves in the healthcare sector, enabling faster diagnoses, personalized treatment plans, and improved patient outcomes. Experts believe this innovation could significantly reduce human error and revolutionize how hospitals manage patient care.",
      category: "Technology"
    },
    {
      id: 2,
      title: "Environmental News",
      text: "Global Climate Summit Reaches Historic Agreement. In a landmark moment for global environmental policy, world leaders have come together at the Climate Summit to sign a historic agreement aimed at drastically reducing carbon emissions and accelerating the shift to renewable energy. The pact sets ambitious targets for 2030.",
      category: "Environment"
    },
    {
      id: 3,
      title: "Business News",
      text: "Economic Markets Are Now Showing Strong Recovery Signs. Global financial markets are showing clear signs of recovery, with major stock indices rising, investor confidence improving, and economic indicators pointing toward sustained growth following a period of volatility.",
      category: "Business"
    },
    {
      id: 4,
      title: "Science News",
      text: "Breakthrough in Space Exploration Technology. A major advancement in space exploration technology is set to revolutionize future missions, with new innovations enhancing spacecraft efficiency, deep-space communication, and the potential for human exploration beyond Earth's orbit.",
      category: "Science"
    },
    {
      id: 5,
      title: "Health News",
      text: "Revolutionary Cancer Treatment Shows Promising Results. A new immunotherapy treatment has demonstrated remarkable success in clinical trials, with patients showing significant improvement in various types of cancer. The treatment works by harnessing the body's own immune system to target and destroy cancer cells more effectively than traditional methods.",
      category: "Health"
    },
    {
      id: 6,
      title: "World News",
      text: "Historic Peace Agreement Signed Between Rival Nations. After decades of conflict and tension, two neighboring nations have signed a historic peace agreement that promises to end hostilities and establish diplomatic relations. The agreement includes economic cooperation, cultural exchange programs, and joint infrastructure projects.",
      category: "World"
    },
    {
      id: 7,
      title: "Sports News",
      text: "Major Sports League Announces Revolutionary Rule Changes. In a bold move to increase game excitement and viewer engagement, the league has announced sweeping rule changes that will fundamentally alter how the sport is played. The new rules include extended play periods, modified scoring systems, and enhanced player safety protocols.",
      category: "Sports"
    },
    {
      id: 8,
      title: "Technology Innovation",
      text: "New Electric Vehicle Battery Technology Achieves 500-Mile Range. Scientists have developed a revolutionary battery technology that enables electric vehicles to travel up to 500 miles on a single charge. This breakthrough addresses one of the biggest concerns about EV adoption - range anxiety. The new battery technology uses advanced lithium-ion chemistry with improved energy density and faster charging capabilities.",
      category: "Technology"
    }
  ];

  const handleContentSelect = (content) => {
    setSelectedContent(content.text);
  };

  return (
    <div className="tts-test-container">
      <div className="tts-test-header">
        <button className="back-btn" onClick={() => onPageChange('landing')}>
          ← Back to News
        </button>
        <h1 className="tts-test-title">🎤 Text-to-Speech Testing</h1>
      </div>

      <div className="tts-test-content">
        <div className="content-selection">
          <h3>Select Sample Content to Test:</h3>
          <div className="content-grid">
            {sampleContents.map((content) => (
              <div 
                key={content.id}
                className={`content-card ${selectedContent === content.text ? 'selected' : ''}`}
                onClick={() => handleContentSelect(content)}
              >
                <div className="content-category">{content.category}</div>
                <h4>{content.title}</h4>
                <p>{content.text.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>

        <div className="tts-demo">
          <TextToSpeech 
            text={selectedContent || "Select a sample content above to test text-to-speech functionality. You can also type your own text in the text area below."}
            title="🎤 Text-to-Speech Demo"
            className="tts-demo-component"
          />
        </div>

        <div className="tts-features">
          <h3>🔧 TTS Features Available:</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4>🎵 Voice Selection</h4>
              <p>Choose from available system voices with different accents and languages</p>
            </div>
            <div className="feature-card">
              <h4>⚡ Speed Control</h4>
              <p>Adjust speech rate from 0.5x to 2x for comfortable listening</p>
            </div>
            <div className="feature-card">
              <h4>🎚️ Pitch Control</h4>
              <p>Modify voice pitch to make it higher or lower as needed</p>
            </div>
            <div className="feature-card">
              <h4>🔊 Volume Control</h4>
              <p>Set volume level from 0% to 100% for optimal audio</p>
            </div>
            <div className="feature-card">
              <h4>⏯️ Playback Controls</h4>
              <p>Play, pause, resume, and stop speech with intuitive buttons</p>
            </div>
            <div className="feature-card">
              <h4>📝 Custom Text</h4>
              <p>Type or paste any text to test speech synthesis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTSTestPage; 