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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmitSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signin({ email: cleanEmail, password });
      setSuccess("✓ Successfully signed in!");
      setTimeout(() => {
        closeAuthModal();
        setSuccess("");
        setError("");
      }, 900);
    } catch (err) {
      setError(err.message || "User doesn't exist");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError("Name is required.");
      return;
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({ name: cleanName, email: cleanEmail, password });
      setSuccess("✓ Account created successfully!");

      // Transition to sign in panel after 1.2s, preserving email
      setTimeout(() => {
        setAuthModalMode("signin");
        setPassword("");
        setSuccess("✓ Account created successfully! Please sign in with your email and password.");
        setError("");
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          {/* Error Message Alert (Red) */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
              ⚠️ {error}
            </div>
          )}

          {/* Success Message Alert (Green) */}
          {success && (
            <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-xs font-semibold text-emerald-600 border border-emerald-200">
              {success}
            </div>
          )}

          {/* SIGN IN FORM (Mandatory fields: Email *, Password *) */}
          {authModalMode === "signin" ? (
            <form onSubmit={handleSubmitSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Email <span className="text-red-500">*</span>
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
                  Password <span className="text-red-500">*</span>{" "}
                  <span className="text-[11px] font-normal text-gray-500">(min. 8 characters)</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password (min 8 characters)"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-orange-600 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-orange-700 active:scale-98 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
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
            /* SIGN UP (CREATE ACCOUNT) FORM (Mandatory fields: Name *, Email *, Password *) */
            <form onSubmit={handleSubmitSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Name <span className="text-red-500">*</span>
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
                  Email <span className="text-red-500">*</span>
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
                  Password <span className="text-red-500">*</span>{" "}
                  <span className="text-[11px] font-normal text-gray-500">(min. 8 characters)</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-orange-600 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-orange-700 active:scale-98 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
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
