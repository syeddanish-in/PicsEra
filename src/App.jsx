import { useState } from 'react'
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import MainContent from './components/MainContent.jsx';

function App() {

  return (
    <div>
      {/* 1. Header Component */}
      <Header />

      {/* 2. Hero Component */}
      <Hero />

      {/* 3. Main Content Component */}
      <MainContent />
    </div>
  )
}

export default App
