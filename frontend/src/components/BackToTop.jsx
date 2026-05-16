import React, { useState, useEffect } from 'react'
import '../styles/BackToTop.css'

const BackToTop = () => {
  const [visible, setVisible] = useState(false)
  const showAfter = 300 // px

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.pageYOffset > showAfter)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // check initial position
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={handleClick}
      aria-label="Back to top"
      title="Back to top"
    >
      ↑
    </button>
  )
}

export default BackToTop
