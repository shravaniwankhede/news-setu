import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import '../styles/Navbar.css';

const Navbar = ({ onPageChange, currentPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const { theme } = useTheme();
  const languageDropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name);
    setLanguageDropdownOpen(false);
    // Here you can add logic to change the app language
    console.log('Language changed to:', language.name);
  };

  const handleAnalyticsClick = () => {
    onPageChange('analytics');
  };

  const handleHomeClick = () => {
    onPageChange('landing');
  };

  return (
    <nav className={`navbar ${theme}`}>
      <div className={`logo ${currentPage === 'landing' ? 'active' : ''}`} onClick={handleHomeClick}>NewsSetu</div>

      <div className="nav-links-desktop">
        <a href="#" onClick={handleHomeClick} className={currentPage === 'landing' ? 'active' : ''}>Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>

      <div className="navbar-right">
        <div className="fixed-buttons">
          <button 
            className={`analytics-btn ${currentPage === 'analytics' ? 'active' : ''}`} 
            onClick={handleAnalyticsClick}
          >
            ⚖︎ Analytics
          </button>
          <div className="language-dropdown-container" ref={languageDropdownRef}>
            <button className="language-btn" onClick={toggleLanguageDropdown}>
              ⎂ {selectedLanguage}
            </button>
            {languageDropdownOpen && (
              <div className="language-dropdown">
                {languages.map((language) => (
                  <div
                    key={language.code}
                    className={`language-option ${selectedLanguage === language.name ? 'active' : ''}`}
                    onClick={() => handleLanguageSelect(language)}
                  >
                    <span className="language-flag">{language.flag}</span>
                    <span className="language-name">{language.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <ThemeToggle />
        </div>
      

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      </div>

      <div className={`dropdown-menu ${menuOpen ? 'active' : ''}`}>
        <a href="#" onClick={handleHomeClick} className={currentPage === 'landing' ? 'active' : ''}>Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;