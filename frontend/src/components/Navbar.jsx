import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import '../styles/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${theme}`}>
      <div className="logo">NewsSetu</div>

      <div className="nav-links-desktop">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>

      <div className="navbar-right">
        <div className="fixed-buttons">
          <button className="analytics-btn">⚖︎ Analytics</button>
          <button className="language-btn">⎂ Language</button>
          <ThemeToggle />
        </div>
      

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      </div>

      <div className={`dropdown-menu ${menuOpen ? 'active' : ''}`}>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;