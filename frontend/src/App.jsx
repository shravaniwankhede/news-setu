import React from 'react'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Navbar from './components/Navbar.jsx'
import LandingPage from './LandingPage.jsx'
import Analytics from './Analytics.jsx'

const App = () => {
  return (
    <ThemeProvider>
      <Navbar/>
      <LandingPage/>
      <Analytics/>
    </ThemeProvider>
  )
}

export default App