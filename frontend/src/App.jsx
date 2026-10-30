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
  const { currentUser, checkoutPhoto } = useAuth();

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased selection:bg-orange-500 selection:text-white flex flex-col justify-between">
      {/* 1. Navigation Header with Auth, Saved & Cart Status */}
      <Header />

      {/* 2. Main Page View: Either PicsEra Studio Page OR Main Gallery Portfolio */}
      {checkoutPhoto ? (
        <main className="flex-1 bg-gray-50/50">
          <CheckoutPage />
        </main>
      ) : (
        <main className="flex-1">
          <Hero />
          <MainContent key={currentUser?.email || "guest"} />
        </main>
      )}

      {/* 3. Footer Component */}
      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <SavedModal />
      <CartModal />
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
