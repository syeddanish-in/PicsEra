import { useState, useEffect } from "react";
import { PHOTOS } from "../data/photo.js";
import { AuthContext } from "./useAuth.js";

const DEFAULT_USERS_KEY = "picsera_registered_users";
const CURRENT_USER_KEY = "picsera_current_user";
const CART_KEY = "picsera_cart_items";

const INITIAL_DEMO_USERS = [
  {
    id: "user_demo_1",
    name: "Danish",
    email: "danish@picsera.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Danish",
  },
];

const getUserSavedKey = (user) => {
  if (!user?.email) return null;
  return `picsera_saved_${user.email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
};

const loadSavedForUser = (user) => {
  const key = getUserSavedKey(user);
  if (!key) return [];
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [savedPhotoIds, setSavedPhotoIds] = useState(() =>
    loadSavedForUser(
      (() => {
        try {
          const stored = localStorage.getItem(CURRENT_USER_KEY);
          return stored ? JSON.parse(stored) : null;
        } catch {
          return null;
        }
      })()
    )
  );

  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("signin");
  const [authModalNotice, setAuthModalNotice] = useState("");
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem(DEFAULT_USERS_KEY);
      if (!stored) {
        localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(INITIAL_DEMO_USERS));
        return INITIAL_DEMO_USERS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_DEMO_USERS;
    }
  };

  const signin = ({ email, password }) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error("Please enter your email.");
    }
    if (!password) {
      throw new Error("Please enter your password.");
    }

    const users = getRegisteredUsers();
    const foundUser = users.find(
      (u) => u.email && u.email.toLowerCase() === cleanEmail
    );

    let userToLogin;
    if (foundUser) {
      userToLogin = foundUser;
    } else {
      // Create account automatically on signin if demo user
      const derivedName = cleanEmail.split("@")[0];
      const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
      userToLogin = {
        id: `user_${Date.now()}`,
        name: formattedName,
        email: cleanEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
      };
      const updatedUsers = [...users, userToLogin];
      localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(updatedUsers));
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToLogin));
    setCurrentUser(userToLogin);
    setSavedPhotoIds(loadSavedForUser(userToLogin));
    setIsAuthModalOpen(false);
    return userToLogin;
  };

  const signup = ({ name, email, password }) => {
    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanName) throw new Error("Please enter your Name.");
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Please enter a valid Email.");
    }
    if (!password || password.length < 10) {
      throw new Error("Password must be at least 8 characters long.");
    }

    const users = getRegisteredUsers();
    const exists = users.find(
      (u) => u.email && u.email.toLowerCase() === cleanEmail
    );

    if (exists) {
      throw new Error("An account with this email already exists. Try signing in.");
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setCurrentUser(newUser);
    setSavedPhotoIds(loadSavedForUser(newUser));
    setIsAuthModalOpen(false);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
    setSavedPhotoIds([]);
  };

  const toggleSavePhoto = (photoId) => {
    if (!currentUser) {
      setAuthModalNotice("Please sign in or create an account to save photos to your personal collection!");
      setAuthModalMode("signin");
      setIsAuthModalOpen(true);
      return false;
    }

    const userSavedKey = getUserSavedKey(currentUser);
    setSavedPhotoIds((prev) => {
      let updated;
      if (prev.includes(photoId)) {
        updated = prev.filter((id) => id !== photoId);
      } else {
        updated = [...prev, photoId];
      }
      if (userSavedKey) {
        try {
          localStorage.setItem(userSavedKey, JSON.stringify(updated));
        } catch (err) {
          console.error("Failed to persist saved photos", err);
        }
      }
      return updated;
    });

    return true;
  };

  const isPhotoSaved = (photoId) => {
    return savedPhotoIds.includes(photoId);
  };

  // User cannot add product without login
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

  const clearCart = () => {
    setCart([]);
  };

  const savedPhotosList = PHOTOS.filter((p) => savedPhotoIds.includes(p.id));
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
