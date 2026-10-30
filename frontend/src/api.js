// API Client configuration
// In production on Vercel/Netlify, set VITE_API_URL to your backend URL (e.g. https://your-backend.railway.app/api)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "picsera_auth_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

// Generic fetch wrapper with auth header injection
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Photos API
  getPhotos: async (category) => {
    const query = category && category !== "All" ? `?category=${encodeURIComponent(category)}` : "";
    return request(`/photos${query}`);
  },

  getPhotoById: async (id) => {
    return request(`/photos/${id}`);
  },

  // Auth API
  signup: async ({ name, email, password }) => {
    return request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async ({ email, password }) => {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: async () => {
    return request("/auth/me");
  },

  // Saved Collection API
  getSavedPhotos: async () => {
    return request("/saved");
  },

  toggleSavePhoto: async (photoId) => {
    return request("/saved/toggle", {
      method: "POST",
      body: JSON.stringify({ photoId }),
    });
  },

  // Inquiries API
  submitInquiry: async (inquiryData) => {
    return request("/inquiries", {
      method: "POST",
      body: JSON.stringify(inquiryData),
    });
  },

  // Checkout & Payments API (Stripe Test Mode)
  createCheckoutSession: async (items) => {
    return request("/checkout/create-session", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  },

  getOrder: async (orderId) => {
    return request(`/checkout/order/${orderId}`);
  },

  verifySession: async (sessionId) => {
    return request(`/checkout/verify-session/${sessionId}`);
  },
};
