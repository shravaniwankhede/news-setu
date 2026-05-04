import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import '../styles/Navbar.css';

const Navbar = ({ onPageChange, currentPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();

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
        <a href="#" onClick={() => onPageChange('saved')} className={currentPage === 'saved' ? 'active' : ''}>🔖 Saved</a>
        <a href="#" onClick={() => onPageChange('about')} className={currentPage === 'about' ? 'active' : ''}>About</a>
      </div>

      <div className="navbar-right">
        <div className="fixed-buttons">
          <button
            className={`analytics-btn ${currentPage === 'analytics' ? 'active' : ''}`}
            onClick={handleAnalyticsClick}
          >
            ⚖︎ Analytics
          </button>
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
        <a href="#" onClick={() => onPageChange('saved')} className={currentPage === 'saved' ? 'active' : ''}>🔖 Saved</a>
        <a href="#" onClick={() => onPageChange('about')} className={currentPage === 'about' ? 'active' : ''}>About</a>
      </div>
    </nav>
  );
};

export default Navbar;