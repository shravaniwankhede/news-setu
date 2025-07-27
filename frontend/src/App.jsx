import React, { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Navbar from './components/Navbar.jsx'
import LandingPage from './LandingPage.jsx'
import Analytics from './Analytics.jsx'
import Summary from './Summary.jsx'
import Saved from './Saved.jsx'

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <ThemeProvider>
      <Navbar onPageChange={handlePageChange} currentPage={currentPage} />
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'analytics' && <Analytics onPageChange={handlePageChange} />}
    </ThemeProvider>
  )
}

export default App