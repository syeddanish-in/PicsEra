import { useState } from "react";
import { useAuth } from "../context/useAuth.js";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    currentUser,
    savedPhotoIds,
    totalCartCount,
    openAuthModal,
    openSavedModal,
    openCartModal,
    logout,
  } = useAuth();

  const handleSavedClick = () => {
    if (!currentUser) {
      openAuthModal("signin", "Sign in to view your personal saved photographs collection!");
    } else {
      openSavedModal();
    }
  };

  const handleCartClick = () => {
    if (!currentUser) {
      openAuthModal("signin", "Sign in to view your cart!");
    } else {
      openCartModal();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-8 px-6 py-4">
        {/* Logo - restored exactly as it was originally */}
        <a href="#home" className="text-2xl font-bold">
          Pics<span className="text-orange-600">Era</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#home"
            className="relative py-1 transition-colors duration-200 hover:text-orange-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-600 after:transition-all after:duration-200 hover:after:w-full"
          >
            Home
          </a>
          <a
            href="#portfolio"
            className="relative py-1 transition-colors duration-200 hover:text-orange-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-600 after:transition-all after:duration-200 hover:after:w-full"
          >
            Portfolio
          </a>
          <a
            href="#about"
            className="relative py-1 transition-colors duration-200 hover:text-orange-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-600 after:transition-all after:duration-200 hover:after:w-full"
          >
            About
          </a>
          <a
            href="#contact"
            className="relative py-1 transition-colors duration-200 hover:text-orange-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-600 after:transition-all after:duration-200 hover:after:w-full"
          >
            Contact
          </a>
        </nav>

        {/* Right side actions: Saved, Cart & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Saved Button with Heart & Counter */}
          <button
            type="button"
            onClick={handleSavedClick}
            className="relative flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-bold text-gray-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 cursor-pointer"
            title="View Saved Photos"
          >
            <span>❤️</span>
            <span>Saved</span>
            {savedPhotoIds.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {savedPhotoIds.length}
              </span>
            )}
          </button>

          {/* Cart Button with Counter */}
          <button
            type="button"
            onClick={handleCartClick}
            className="relative flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-bold text-gray-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
            title="View Cart"
          >
            <span>🛒</span>
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
                {totalCartCount}
              </span>
            )}
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          {/* User Auth Section: Displays user's name when logged in */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/70 py-1 pl-1.5 pr-3"
                title={`Signed in as ${currentUser.name} (${currentUser.email})`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-6 w-6 rounded-full bg-orange-200"
                />
                <span className="text-xs font-bold text-gray-800 max-w-28 truncate">
                  {currentUser.name}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            /* Only Sign In button shown */
            <button
              type="button"
              onClick={() => openAuthModal("signin")}
              className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-orange-700 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Action Buttons and Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Quick Heart for Mobile */}
          <button
            type="button"
            onClick={handleSavedClick}
            className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            aria-label="Saved Photos"
          >
            <span>❤️</span>
            {savedPhotoIds.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                {savedPhotoIds.length}
              </span>
            )}
          </button>

          {/* Quick Cart for Mobile */}
          <button
            type="button"
            onClick={handleCartClick}
            className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            aria-label="Cart"
          >
            <span>🛒</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[9px] font-bold text-white">
                {totalCartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-2xl transition-colors hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white p-5 md:hidden shadow-lg">
          <nav className="flex flex-col gap-3 font-medium text-gray-700">
            <a
              href="#home"
              className="py-1 hover:text-orange-600"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#portfolio"
              className="py-1 hover:text-orange-600"
              onClick={() => setMenuOpen(false)}
            >
              Portfolio
            </a>
            <a
              href="#about"
              className="py-1 hover:text-orange-600"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#contact"
              className="py-1 hover:text-orange-600"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>

            <div className="my-2 border-t border-gray-100 pt-3">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-8 w-8 rounded-full bg-orange-100"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-lg border border-red-200 bg-red-50 py-2 text-center text-xs font-bold text-red-600 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                /* Only Sign In button shown on mobile */
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal("signin");
                    setMenuOpen(false);
                  }}
                  className="w-full rounded-lg bg-orange-600 py-2.5 text-center text-xs font-semibold text-white cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
