import React, { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Navbar from './components/Navbar.jsx'
import LandingPage from './LandingPage.jsx'
import Analytics from './Analytics.jsx'
import Summary from './Summary.jsx'
import About from './About.jsx'


const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handlePageChange = (page, article = null) => {
    setCurrentPage(page);
    if (article) {
      setSelectedArticle(article);
    }
  };

  return (
    <ThemeProvider>
      <Navbar onPageChange={handlePageChange} currentPage={currentPage} />
      {currentPage === 'landing' && <LandingPage onPageChange={handlePageChange} />}
      {currentPage === 'analytics' && <Analytics onPageChange={handlePageChange} />}
      {currentPage === 'summary' && <Summary onPageChange={handlePageChange} selectedArticle={selectedArticle} />}
      {currentPage === 'saved' && <Saved onPageChange={handlePageChange} />}
      {currentPage === 'about' && <About onPageChange={handlePageChange} />}
      {currentPage === 'tts-test' && <TTSTestPage onPageChange={handlePageChange} />}
    </ThemeProvider>
  )
}

export default App