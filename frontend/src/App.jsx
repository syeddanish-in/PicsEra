import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import MainContent from "./components/MainContent.jsx";
import Footer from "./components/Footer.jsx";
import AuthModal from "./components/AuthModal.jsx";
import SavedModal from "./components/SavedModal.jsx";
import CartModal from "./components/CartModal.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-gray-900 antialiased selection:bg-orange-500 selection:text-white">
        {/* 1. Navigation Header with Auth, Saved & Cart Status */}
        <Header />

        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Main Content Component (Portfolio, Filter, Star Ratings, Prints, About, Contact) */}
        <MainContent />

        {/* 4. Footer Component */}
        <Footer />

        {/* Global Modals */}
        <AuthModal />
        <SavedModal />
        <CartModal />
      </div>
      <Analytics />
    </AuthProvider>
  );
}

export default App;
