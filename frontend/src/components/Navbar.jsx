import React, { useState } from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
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
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "☽ Dark Mode" : "☀︎ Light Mode"}
          </button>
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