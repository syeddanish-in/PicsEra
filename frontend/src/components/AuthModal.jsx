import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth.js";

function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    authModalNotice,
    signin,
    signup,
  } = useAuth();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeAuthModal();
    };
    if (isAuthModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSwitchMode = (mode) => {
    setError("");
    setSuccess("");
    setAuthModalMode(mode);
  };

  const handleSubmitSignIn = (e) => {
    e.preventDefault();
    setError("");
    try {
      signin({ email, password });
      setSuccess("Successfully signed in!");
    } catch (err) {
      setError(err.message || "Failed to sign in");
    }
  };

  const handleSubmitSignUp = (e) => {
    e.preventDefault();
    setError("");
    try {
      signup({ name, email, password });
      setSuccess("Account created successfully!");
    } catch (err) {
      setError(err.message || "Failed to create account");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-300"
      onClick={closeAuthModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-linear-to-r from-orange-600 to-amber-500 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">
              Pics<span className="text-amber-200">Era</span> Member Portal
            </h2>
            <button
              onClick={closeAuthModal}
              className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white cursor-pointer"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-xs text-orange-100">
            {authModalMode === "signin"
              ? "Sign in to access your saved photos & print orders"
              : "Create an account to save favorite photos & personalize your portfolio"}
          </p>
        </div>

        {/* Dynamic Context Notice */}
        {authModalNotice && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs font-medium text-amber-800">
            <span>💡</span>
            <span>{authModalNotice}</span>
          </div>
        )}

        {/* Tab switchers */}
        <div className="mt-4 flex border-b border-gray-100 px-6">
          <button
            type="button"
            onClick={() => handleSwitchMode("signin")}
            className={`flex-1 pb-3 text-center text-sm font-semibold transition-colors duration-200 cursor-pointer ${
              authModalMode === "signin"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode("signup")}
            className={`flex-1 pb-3 text-center text-sm font-semibold transition-colors duration-200 cursor-pointer ${
              authModalMode === "signup"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-xs font-semibold text-emerald-600 border border-emerald-200">
              ✓ {success}
            </div>
          )}

          {/* SIGN IN FORM */}
          {authModalMode === "signin" ? (
            <form onSubmit={handleSubmitSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-orange-600 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-orange-700 active:scale-98 cursor-pointer"
              >
                Sign In
              </button>

              <div className="text-center pt-2 text-xs text-gray-600">
                <span>New to PicsEra? </span>
                <button
                  type="button"
                  onClick={() => handleSwitchMode("signup")}
                  className="font-semibold text-orange-600 hover:underline cursor-pointer"
                >
                  Create an account.
                </button>
              </div>
            </form>
          ) : (
            /* SIGN UP (CREATE ACCOUNT) FORM */
            <form onSubmit={handleSubmitSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-orange-600 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-orange-700 active:scale-98 cursor-pointer"
              >
                Create Account
              </button>

              <div className="text-center pt-2 text-xs text-gray-600">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => handleSwitchMode("signin")}
                  className="font-semibold text-orange-600 hover:underline cursor-pointer"
                >
                  Sign In.
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
