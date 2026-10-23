import { useState, useEffect, useCallback } from "react";
import { PHOTOS } from "../data/photo.js";
import { AuthContext } from "./useAuth.js";
import { api, getToken, setToken } from "../api.js";

const CURRENT_USER_KEY = "picsera_current_user";
const CART_KEY = "picsera_cart_items";

export function AuthProvider({ children }) {
  // Current logged-in user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Array of saved photo IDs (e.g. [1, 5, 8])
  const [savedPhotoIds, setSavedPhotoIds] = useState([]);
  // Full list of saved photo objects
  const [savedPhotosList, setSavedPhotosList] = useState([]);

  // Cart stored locally
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("signin");
  const [authModalNotice, setAuthModalNotice] = useState("");
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  // Helper to load saved photos from real backend API (or fallback)
  const refreshSavedPhotos = useCallback(async () => {
    if (!getToken()) {
      setSavedPhotoIds([]);
      setSavedPhotosList([]);
      return;
    }

    try {
      const data = await api.getSavedPhotos();
      setSavedPhotoIds(data.savedPhotoIds || []);
      setSavedPhotosList(data.savedPhotos || []);
    } catch {
      // Fallback to localStorage if backend not yet running
      try {
        const storedUser = localStorage.getItem(CURRENT_USER_KEY);
        const u = storedUser ? JSON.parse(storedUser) : null;
        if (u?.email) {
          const key = `picsera_saved_${u.email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
          const localSaved = JSON.parse(localStorage.getItem(key) || "[]");
          setSavedPhotoIds(localSaved);
          setSavedPhotosList(PHOTOS.filter((p) => localSaved.includes(p.id)));
        }
      } catch {
        // Ignored
      }
    }
  }, []);

  // On initial mount: verify real session with backend /api/auth/me (survives page refresh)
  useEffect(() => {
    const initSession = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const data = await api.getMe();
        if (data.user) {
          setCurrentUser(data.user);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
          refreshSavedPhotos();
        }
      } catch {
        // If token is expired, clean session
        setToken(null);
        localStorage.removeItem(CURRENT_USER_KEY);
        setCurrentUser(null);
      }
    };

    initSession();
  }, [refreshSavedPhotos]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  // Sign In using real backend API
  const signin = async ({ email, password }) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) throw new Error("Please enter your email.");
    if (!password) throw new Error("Please enter your password.");

    try {
      const data = await api.login({ email: cleanEmail, password });
      setToken(data.token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      setCurrentUser(data.user);
      setIsAuthModalOpen(false);
      refreshSavedPhotos();
      return data.user;
    } catch (apiError) {
      throw new Error(apiError.message || "Failed to sign in. Please verify your credentials.", {
        cause: apiError,
      });
    }
  };

  // Sign Up using real backend API
  const signup = async ({ name, email, password }) => {
    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanName) throw new Error("Please enter your Name.");
    if (!cleanEmail || !cleanEmail.includes("@")) throw new Error("Please enter a valid Email.");
    if (!password || password.length < 4) throw new Error("Password must be at least 4 characters long.");

    try {
      const data = await api.signup({ name: cleanName, email: cleanEmail, password });
      setToken(data.token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      setCurrentUser(data.user);
      setIsAuthModalOpen(false);
      setSavedPhotoIds([]);
      setSavedPhotosList([]);
      return data.user;
    } catch (apiError) {
      throw new Error(apiError.message || "Failed to create account. Please try again.", {
        cause: apiError,
      });
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
    setSavedPhotoIds([]);
    setSavedPhotosList([]);
  };

  // Toggle Save Photo via real API
  const toggleSavePhoto = async (photoId) => {
    if (!currentUser) {
      setAuthModalNotice("Please sign in or create an account to save photos to your personal collection!");
      setAuthModalMode("signin");
      setIsAuthModalOpen(true);
      return false;
    }

    const cleanId = parseInt(photoId, 10);

    // Optimistic UI update
    setSavedPhotoIds((prev) =>
      prev.includes(cleanId) ? prev.filter((id) => id !== cleanId) : [...prev, cleanId]
    );

    try {
      await api.toggleSavePhoto(cleanId);
      refreshSavedPhotos();
    } catch (err) {
      console.warn("API toggle save warning, falling back to local storage:", err.message);
      // Fallback local persistence
      const key = `picsera_saved_${currentUser.email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
      const updated = savedPhotoIds.includes(cleanId)
        ? savedPhotoIds.filter((id) => id !== cleanId)
        : [...savedPhotoIds, cleanId];
      localStorage.setItem(key, JSON.stringify(updated));
    }

    return true;
  };

  const isPhotoSaved = (photoId) => {
    return savedPhotoIds.includes(parseInt(photoId, 10));
  };

  // Add to cart (login required)
  const addToCart = (photo, quantity = 1) => {
    if (!currentUser) {
      setAuthModalNotice("Please sign in to add photos to your cart!");
      setAuthModalMode("signin");
      setIsAuthModalOpen(true);
      return false;
    }

    const qty = quantity > 0 ? quantity : 1;
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.photoId === photo.id);
      if (existingIndex > -1) {
        const next = [...prevCart];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + qty,
        };
        return next;
      } else {
        return [...prevCart, { photoId: photo.id, quantity: qty, photo }];
      }
    });
    return true;
  };

  const updateCartQuantity = (photoId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(photoId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.photoId === photoId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (photoId) => {
    setCart((prev) => prev.filter((item) => item.photoId !== photoId));
  };

  const clearCart = () => setCart([]);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const openAuthModal = (mode = "signin", notice = "") => {
    setAuthModalMode(mode);
    setAuthModalNotice(notice);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        savedPhotoIds,
        savedPhotosList,
        isPhotoSaved,
        toggleSavePhoto,
        cart,
        totalCartCount,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        signin,
        signup,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal: () => setIsAuthModalOpen(false),
        authModalMode,
        setAuthModalMode,
        authModalNotice,
        isSavedModalOpen,
        openSavedModal: () => setIsSavedModalOpen(true),
        closeSavedModal: () => setIsSavedModalOpen(false),
        isCartModalOpen,
        openCartModal: () => setIsCartModalOpen(true),
        closeCartModal: () => setIsCartModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
