
import React from 'react'

const Header = () => {
  return (
    <header className="sticky top-0 bg-white shadow-md">
      <div className="flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <a href="#home" className="text-2xl font-bold">
          Pics<span className="text-orange-600">Era</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#home" className="hover:text-orange-600">Home</a>
          <a href="#portfolio" className="hover:text-orange-600">Portfolio</a>
          <a href="#about" className="hover:text-orange-600">About</a>
          <a href="#contact" className="hover:text-orange-600">Contact</a>

          <a
            href="#contact"
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-500"
          >
            Book a Shoot
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header