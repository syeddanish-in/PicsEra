import { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import MainContent from "./components/MainContent.jsx";
import Footer from "./components/Footer.jsx";
import AuthModal from "./components/AuthModal.jsx";
import SavedModal from "./components/SavedModal.jsx";
import CartModal from "./components/CartModal.jsx";
import CheckoutPage from "./components/CheckoutPage.jsx";
import OrderSuccess from "./components/OrderSuccess.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import { useAuth } from "./context/useAuth.js";
import { Analytics } from "@vercel/analytics/react";

function AppContent() {
  const { currentUser, checkoutPhoto } = useAuth();

  // Detect Stripe Checkout return or success page route
  const [isSuccessView, setIsSuccessView] = useState(() => {
    return (
      window.location.pathname.includes("/order/success") ||
      window.location.search.includes("session_id=")
    );
  });

  const [cancelNotice, setCancelNotice] = useState(() => {
    if (window.location.search.includes("checkout=cancelled")) {
      return "Payment was cancelled. Your selected prints remain saved in your cart.";
    }
    return null;
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setIsSuccessView(
        window.location.pathname.includes("/order/success") ||
        window.location.search.includes("session_id=")
      );
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const handleReturnHome = () => {
    setIsSuccessView(false);
    setCancelNotice(null);
    window.history.replaceState({}, document.title, "/");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased selection:bg-orange-500 selection:text-white flex flex-col justify-between">
      {/* 1. Navigation Header with Auth, Saved & Cart Status */}
      <Header />

      {/* Cancellation Notice Banner */}
      {cancelNotice && !isSuccessView && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center text-xs font-medium text-amber-800 flex items-center justify-center gap-2">
          <span>ℹ️ {cancelNotice}</span>
          <button
            onClick={() => {
              setCancelNotice(null);
              window.history.replaceState({}, document.title, window.location.pathname);
            }}
            className="text-amber-900 underline font-bold ml-2 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Main Page View: Order Success OR PicsEra Studio Page OR Main Gallery Portfolio */}
      {isSuccessView ? (
        <main className="flex-1 bg-gray-50/50">
          <OrderSuccess onReturnHome={handleReturnHome} />
        </main>
      ) : checkoutPhoto ? (
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
