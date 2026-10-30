import { useState, useEffect, useCallback } from "react";
import { PHOTOS } from "../data/photo.js";
import { AuthContext } from "./useAuth.js";
import { api, getToken, setToken } from "../api.js";

const CURRENT_USER_KEY = "picsera_current_user";

// User-specific cart storage helpers
const getUserCartKey = (user) => {
  if (!user?.email) return null;
  return `picsera_cart_${user.email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
};

const loadCartForUser = (user) => {
  const key = getUserCartKey(user);
  if (!key) return [];
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

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

  // Cart stored strictly per authenticated user
  const [cart, setCart] = useState(() => {
    try {
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      const u = storedUser ? JSON.parse(storedUser) : null;
      return loadCartForUser(u);
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
  const [checkoutPhoto, setCheckoutPhoto] = useState(null);

  const openCheckout = (photo = null) => {
    const target = photo || cart[0]?.photo || PHOTOS[0];
    setCheckoutPhoto(target);
    setIsCartModalOpen(false);
    setIsSavedModalOpen(false);
  };

  const closeCheckout = () => {
    setCheckoutPhoto(null);
  };

  // Helper to load saved photos from real backend API
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
      // Fallback to local storage if API is offline
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
      if (!token) {
        setCurrentUser(null);
        setSavedPhotoIds([]);
        setSavedPhotosList([]);
        setCart([]);
        return;
      }

      try {
        const data = await api.getMe();
        if (data.user) {
          setCurrentUser(data.user);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
          // Restore user's personal cart
          const userCart = loadCartForUser(data.user);
          setCart(userCart);
          refreshSavedPhotos();
        } else {
          throw new Error("Invalid session");
        }
      } catch {
        // If token is invalid or user doesn't exist, clear session
        setToken(null);
        localStorage.removeItem(CURRENT_USER_KEY);
        setCurrentUser(null);
        setSavedPhotoIds([]);
        setSavedPhotosList([]);
        setCart([]);
      }
    };

    initSession();
  }, [refreshSavedPhotos]);

  // Persist cart to user's personal storage whenever cart changes
  useEffect(() => {
    if (currentUser) {
      const key = getUserCartKey(currentUser);
      if (key) {
        try {
          localStorage.setItem(key, JSON.stringify(cart));
        } catch (e) {
          console.error("Failed to save cart to localStorage", e);
        }
      }
    }
  }, [cart, currentUser]);

  // Sign In using real backend API
  const signin = async ({ email, password }) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("A valid email is required.");
    }
    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    try {
      const data = await api.login({ email: cleanEmail, password });
      setToken(data.token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      setCurrentUser(data.user);

      // Restore cart specifically for this user
      const restoredCart = loadCartForUser(data.user);
      setCart(restoredCart);

      refreshSavedPhotos();
      return data.user;
    } catch (apiError) {
      throw new Error(apiError.message || "User doesn't exist", {
        cause: apiError,
      });
    }
  };

  // Sign Up using real backend API (does NOT auto-login, redirects user to sign in)
  const signup = async ({ name, email, password }) => {
    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanName) throw new Error("Name is required.");
    if (!cleanEmail || !cleanEmail.includes("@")) throw new Error("A valid email is required.");
    if (!password || password.length < 8) throw new Error("Password must be at least 8 characters long.");

    try {
      const data = await api.signup({ name: cleanName, email: cleanEmail, password });
      return data;
    } catch (apiError) {
      throw new Error(apiError.message || "Failed to create account. Please try again.", {
        cause: apiError,
      });
    }
  };

  // Sign Out: hides cart from active session, preserves user's cart in localStorage
  const logout = () => {
    setToken(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
    setSavedPhotoIds([]);
    setSavedPhotosList([]);
    setCart([]); // Not visible when logged out
  };

  // Clear Cart: empties cart and removes stored cart for current user (used after inquiry is sent)
  const clearCart = () => {
    setCart([]);
    if (currentUser) {
      const key = getUserCartKey(currentUser);
      if (key) {
        localStorage.removeItem(key);
      }
    }
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
      const key = `picsera_saved_${currentUser.email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
      const updated = savedPhotoIds.includes(cleanId)
        ? savedPhotoIds.filter((id) => id !== cleanId)
        : [...savedPhotoIds, cleanId];
      localStorage.setItem(key, JSON.stringify(updated));
    }

    return true;
  };

  const isPhotoSaved = (photoId) => {
    if (!currentUser) return false;
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

  // Counts strictly hidden when not signed in
  const totalCartCount = currentUser ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const activeSavedCount = currentUser ? savedPhotoIds.length : 0;

  const openAuthModal = (mode = "signin", notice = "") => {
    setAuthModalMode(mode);
    setAuthModalNotice(notice);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        savedPhotoIds: currentUser ? savedPhotoIds : [],
        savedPhotosList: currentUser ? savedPhotosList : [],
        activeSavedCount,
        isPhotoSaved,
        toggleSavePhoto,
        cart: currentUser ? cart : [],
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
        openCartModal: () => openCheckout(),
        closeCartModal: () => setIsCartModalOpen(false),
        checkoutPhoto,
        openCheckout,
        closeCheckout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
