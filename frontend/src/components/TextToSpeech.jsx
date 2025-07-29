import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';

const TextToSpeech = ({ text, title = "Text to Speech", className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState(text);
  const [speechRate, setSpeechRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isWindows, setIsWindows] = useState(false);
  const speechRef = useRef(null);

  // Initialize speech synthesis
  React.useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load available voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        // Windows-specific voice selection
        const isWindows = navigator.platform.indexOf('Win') !== -1;
        if (voices.length > 0 && !selectedVoice) {
          if (isWindows) {
            // Prefer Microsoft voices on Windows for better quality
            const microsoftVoice = voices.find(voice => 
              voice.name.includes('Microsoft') && voice.lang.startsWith('en')
            );
            setSelectedVoice(microsoftVoice || voices[0]);
          } else {
            setSelectedVoice(voices[0]);
          }
        }
      };

      // Load voices when they become available
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();

      // Windows-specific optimizations
      const isWindows = navigator.platform.indexOf('Win') !== -1;
      setIsWindows(isWindows);
      if (isWindows) {
        console.log('Windows detected - using Windows Speech Synthesis');
        // Windows typically has better voice quality
        // The voices will be automatically loaded from Windows SAPI
      }

      // Set up speech synthesis
      speechRef.current = new SpeechSynthesisUtterance();
      speechRef.current.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      speechRef.current.onpause = () => setIsPaused(true);
      speechRef.current.onresume = () => setIsPaused(false);
      speechRef.current.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        setIsPaused(false);
      };
    }
  }, [selectedVoice]);

  // Update speech properties when settings change
  React.useEffect(() => {
    if (speechRef.current) {
      speechRef.current.rate = speechRate;
      speechRef.current.pitch = pitch;
      speechRef.current.volume = volume;
      if (selectedVoice) {
        speechRef.current.voice = selectedVoice;
      }
    }
  }, [speechRate, pitch, volume, selectedVoice]);

  const speak = () => {
    if (!speechRef.current || !text) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    // Set up new speech
    speechRef.current.text = currentText;
    speechRef.current.rate = speechRate;
    speechRef.current.pitch = pitch;
    speechRef.current.volume = volume;
    if (selectedVoice) {
      speechRef.current.voice = selectedVoice;
    }

    // Start speaking
    window.speechSynthesis.speak(speechRef.current);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const reset = () => {
    stop();
    setCurrentText(text);
    setSpeechRate(1);
    setPitch(1);
    setVolume(1);
  };

  if (!('speechSynthesis' in window)) {
    return (
      <div className={`tts-container ${className}`}>
        <div className="tts-error">
          <VolumeX size={20} />
          <span>Text-to-Speech not supported in this browser</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`tts-container ${className}`}>
      <div className="tts-header">
        <div className="tts-title-section">
          <h3>{title}</h3>
          {isWindows && (
            <span className="windows-indicator" title="Using Windows Speech Synthesis">
              🪟 Windows TTS
            </span>
          )}
        </div>
        <div className="tts-controls">
          {!isPlaying && !isPaused && (
            <button 
              className="tts-btn play-btn" 
              onClick={speak}
              title="Play"
            >
              <Play size={16} />
            </button>
          )}
          {isPlaying && !isPaused && (
            <button 
              className="tts-btn pause-btn" 
              onClick={pause}
              title="Pause"
            >
              <Pause size={16} />
            </button>
          )}
          {isPaused && (
            <button 
              className="tts-btn resume-btn" 
              onClick={resume}
              title="Resume"
            >
              <Play size={16} />
            </button>
          )}
          {(isPlaying || isPaused) && (
            <button 
              className="tts-btn stop-btn" 
              onClick={stop}
              title="Stop"
            >
              <VolumeX size={16} />
            </button>
          )}
          <button 
            className="tts-btn reset-btn" 
            onClick={reset}
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="tts-settings">
        <div className="setting-group">
          <label>Voice:</label>
          <select 
            value={selectedVoice?.name || ''} 
            onChange={(e) => {
              const voice = availableVoices.find(v => v.name === e.target.value);
              setSelectedVoice(voice);
            }}
          >
            {availableVoices.map((voice, index) => (
              <option key={index} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="setting-group">
          <label>Speed:</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
          />
          <span>{speechRate}x</span>
        </div>

        <div className="setting-group">
          <label>Pitch:</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
          />
          <span>{pitch}</span>
        </div>

        <div className="setting-group">
          <label>Volume:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
          <span>{Math.round(volume * 100)}%</span>
        </div>
      </div>

      <div className="tts-text">
        <label>Text to speak:</label>
        <textarea
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          placeholder="Enter text to speak..."
          rows={4}
        />
      </div>

      <div className="tts-status">
        {isPlaying && !isPaused && (
          <span className="status playing">
            <Volume2 size={14} />
            Playing...
          </span>
        )}
        {isPaused && (
          <span className="status paused">
            <Pause size={14} />
            Paused
          </span>
        )}
        {!isPlaying && !isPaused && (
          <span className="status stopped">
            Ready to play
          </span>
        )}
      </div>
    </div>
  );
};

export default TextToSpeech; 