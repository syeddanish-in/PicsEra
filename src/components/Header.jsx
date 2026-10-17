import React, { useState } from 'react';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-8 px-6 py-4">

        {/* Logo */}
        <a href="#home" className="text-2xl font-bold">
          Pics<span className="text-orange-600">Era</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#home" className="relative py-1 transition-colors duration-200 hover:text-orange-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-600 after:transition-all after:duration-200 hover:after:w-full">Home</a>
          <a href="#portfolio" className="relative py-1 transition-colors duration-200 hover:text-orange-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-600 after:transition-all after:duration-200 hover:after:w-full">Portfolio</a>
          <a href="#about" className="relative py-1 transition-colors duration-200 hover:text-orange-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-600 after:transition-all after:duration-200 hover:after:w-full">About</a>
          <a href="#contact" className="relative py-1 transition-colors duration-200 hover:text-orange-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-600 after:transition-all after:duration-200 hover:after:w-full">Contact</a>
        </nav>

        {/* Mobile Menu Button and Navigation */}
        <div className="relative md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-2xl transition-colors hover:bg-orange-50 hover:text-orange-600"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Mobile Navigation */}
          {menuOpen && (
            <nav className="absolute right-0 top-full mt-3 flex w-48 flex-col gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-xl">
              <a href="#home" className="hover:text-orange-600" onClick={() => setMenuOpen(false)}>Home</a>
              <a href="#portfolio" className="hover:text-orange-600" onClick={() => setMenuOpen(false)}>Portfolio</a>
              <a href="#about" className="hover:text-orange-600" onClick={() => setMenuOpen(false)}>About</a>
              <a href="#contact" className="hover:text-orange-600" onClick={() => setMenuOpen(false)}>Contact</a>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
