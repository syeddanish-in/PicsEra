import { useState } from 'react'
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import MainContent from './components/MainContent.jsx';

function App() {

  return (
    <div>
      {/* Header Component */}
      <Header />

      {/* Hero Component */}
      <Hero />

      {/* Main Content Component */}
      <MainContent />
    </div>
  )
}

export default App
