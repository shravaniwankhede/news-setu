import React, { useState } from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <nav className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      <div className="navbar-left">
        <div className="logo">NewsSetu</div>
      </div>
      <div className="navbar-right">
        <div className="fixed-buttons">
          <button className="analytics-btn">📊 Analytics</button>
          <button className="language-btn">🌐 Language</button>
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>


        <div className="navbar-center nav-links-desktop">
        <a href="#">Home</a>
        <a href="#">Contact</a>
        <a href="#">About</a>
      </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`dropdown-menu ${menuOpen ? 'active' : ''}`}>
          <a href="#">Home</a>
          <a href="#">Contact</a>
          <a href="#">About</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


          