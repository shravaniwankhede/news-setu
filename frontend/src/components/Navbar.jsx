import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <motion.nav 
      className={`navbar ${theme}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <motion.div 
        className={`logo ${currentPage === 'landing' ? 'active' : ''}`} 
        onClick={handleHomeClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        NewsSetu
      </motion.div>

      <div className="nav-links-desktop">
        <motion.a whileHover={{ y: -2 }} href="#" onClick={handleHomeClick} className={currentPage === 'landing' ? 'active' : ''}>Home</motion.a>
        <motion.a whileHover={{ y: -2 }} href="#" onClick={() => onPageChange('saved')} className={currentPage === 'saved' ? 'active' : ''}>🔖 Saved</motion.a>
        <motion.a whileHover={{ y: -2 }} href="#" onClick={() => onPageChange('about')} className={currentPage === 'about' ? 'active' : ''}>About</motion.a>
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
    </motion.nav>
  );
};

export default Navbar;