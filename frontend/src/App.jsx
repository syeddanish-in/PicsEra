import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import MainContent from "./components/MainContent.jsx";
import Footer from "./components/Footer.jsx";
import AuthModal from "./components/AuthModal.jsx";
import SavedModal from "./components/SavedModal.jsx";
import CartModal from "./components/CartModal.jsx";
import CheckoutPage from "./components/CheckoutPage.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import { useAuth } from "./context/useAuth.js";
import { Analytics } from "@vercel/analytics/react";

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased selection:bg-orange-500 selection:text-white">
      {/* 1. Navigation Header with Auth, Saved & Cart Status */}
      <Header />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Main Content Component (Keyed by user to reset ratings and inquiry form on logout or user switch) */}
      <MainContent key={currentUser?.email || "guest"} />

      {/* 4. Footer Component */}
      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <SavedModal />
      <CartModal />
      <CheckoutPage />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Analytics />
    </AuthProvider>
  );
}

export default App;
