import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth.js";
import { PHOTOS } from "../data/photo.js";

const PRODUCT_TYPES = [
  {
    id: "framed_canvas",
    label: "FRAMED CANVAS",
    description: "Gallery wrap with floating shadowbox frame",
    priceMultiplier: 1.25,
  },
  {
    id: "framed_print",
    label: "FRAMED PRINT",
    description: "Solid wood frame with archival mat",
    priceMultiplier: 1.0,
  },
  {
    id: "canvas",
    label: "CANVAS",
    description: "Frameless gallery-wrapped canvas",
    priceMultiplier: 0.9,
  },
];

const SIZES = [
  { id: "small", label: "Small 30 × 40 cm", basePrice: 45 },
  { id: "medium", label: "Medium 45 × 60 cm", basePrice: 75 },
  { id: "med_large", label: "Medium Large 60 × 80 cm", basePrice: 110 },
  { id: "large", label: "Large 75 × 100 cm", basePrice: 150 },
  { id: "xlarge", label: "Extra Large 90 × 120 cm", basePrice: 185 },
];

export default function CheckoutPage() {
  const {
    checkoutPhoto,
    closeCheckout,
    currentUser,
    openAuthModal,
    isPhotoSaved,
    toggleSavePhoto,
    cart,
    updateCartItem,
  } = useAuth();

  // Multi-item cart list: all photos in cart or single active photo
  const items =
    cart.length > 0
      ? cart.map((item) => item.photo)
      : checkoutPhoto
      ? [checkoutPhoto]
      : [PHOTOS[0]];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Per-item individual configuration dictionary: { [photoId]: { productTypeId, sizeId, quantity } }
  const [itemConfigs, setItemConfigs] = useState(() => {
    const initial = {};
    const sourceItems = cart.length > 0 ? cart : (checkoutPhoto ? [{ photoId: checkoutPhoto.id, quantity: 1, photo: checkoutPhoto }] : []);
    sourceItems.forEach((cItem) => {
      initial[cItem.photoId] = {
        productTypeId: cItem.configuredType?.id || "framed_canvas",
        sizeId: cItem.configuredSize?.id || "small",
        quantity: cItem.quantity || 1,
      };
    });
    return initial;
  });

  // Sync itemConfigs when cart items are added/modified
  useEffect(() => {
    if (cart.length > 0) {
      setItemConfigs((prev) => {
        const next = { ...prev };
        cart.forEach((cItem) => {
          if (!next[cItem.photoId]) {
            next[cItem.photoId] = {
              productTypeId: cItem.configuredType?.id || "framed_canvas",
              sizeId: cItem.configuredSize?.id || "small",
              quantity: cItem.quantity || 1,
            };
          }
        });
        return next;
      });
    }
  }, [cart]);

  // Sync index when a specific checkoutPhoto is passed from cart
  useEffect(() => {
    if (checkoutPhoto && cart.length > 0) {
      const idx = cart.findIndex((item) => item.photo?.id === checkoutPhoto.id);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [checkoutPhoto, cart]);

  // Keep index within bounds
  const safeIndex = currentIndex >= items.length ? 0 : currentIndex;
  const activePhoto = items[safeIndex] || items[0] || PHOTOS[0];

  // Retrieve current active item's individual configuration (defaults: FRAMED CANVAS & Small 30 × 40 cm)
  const currentConfig = itemConfigs[activePhoto.id] || {
    productTypeId: "framed_canvas",
    sizeId: "small",
    quantity: 1,
  };
  const selectedType =
    PRODUCT_TYPES.find((t) => t.id === currentConfig.productTypeId) || PRODUCT_TYPES[0];
  const selectedSize =
    SIZES.find((s) => s.id === currentConfig.sizeId) || SIZES[0];
  const quantity = currentConfig.quantity || 1;

  // Handlers to update active item's individual configuration
  const handleSelectType = (type) => {
    setItemConfigs((prev) => ({
      ...prev,
      [activePhoto.id]: {
        ...(prev[activePhoto.id] || { sizeId: "small", quantity: 1 }),
        productTypeId: type.id,
      },
    }));
  };

  const handleSelectSize = (size) => {
    setItemConfigs((prev) => ({
      ...prev,
      [activePhoto.id]: {
        ...(prev[activePhoto.id] || { productTypeId: "framed_canvas", quantity: 1 }),
        sizeId: size.id,
      },
    }));
  };

  const handleQuantityChange = (newQty) => {
    const validQty = Math.max(1, newQty);
    setItemConfigs((prev) => ({
      ...prev,
      [activePhoto.id]: {
        ...(prev[activePhoto.id] || { productTypeId: "framed_canvas", sizeId: "small" }),
        quantity: validQty,
      },
    }));
  };

  // Arrow navigation between cart items
  const handlePrevItem = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNextItem = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  // Update Cart action: persists the current item's custom configuration into cart
  const handleUpdateCart = () => {
    const unitPrice = Math.round(selectedSize.basePrice * selectedType.priceMultiplier);
    if (updateCartItem) {
      updateCartItem(activePhoto.id, {
        configuredType: selectedType,
        configuredSize: selectedSize,
        quantity,
        unitPrice,
      });
    }
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 2000);
  };

  // Calculate total order amount across all items
  const totalOrderAmount = items.reduce((sum, photo) => {
    const cfg = itemConfigs[photo.id] || { productTypeId: "framed_canvas", sizeId: "small", quantity: 1 };
    const pType = PRODUCT_TYPES.find((t) => t.id === cfg.productTypeId) || PRODUCT_TYPES[0];
    const pSize = SIZES.find((s) => s.id === cfg.sizeId) || SIZES[0];
    const pQty = cfg.quantity || 1;
    const pUnitPrice = Math.round(pSize.basePrice * pType.priceMultiplier);
    return sum + pUnitPrice * pQty;
  }, 0);

  // Ratings synchronized per user
  const [userRatings, setUserRatings] = useState(() => {
    if (!currentUser?.email) return {};
    try {
      const key = `picsera_ratings_${currentUser.email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const handleRate = (rating) => {
    if (!currentUser) {
      openAuthModal("signin", "Please sign in to rate this photograph!");
      return;
    }
    setUserRatings((prev) => {
      const next = { ...prev, [activePhoto.id]: rating };
      try {
        const key = `picsera_ratings_${currentUser.email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Ignored
      }
      return next;
    });
  };

  const isSaved = activePhoto ? isPhotoSaved(activePhoto.id) : false;

  // Dynamic unit price for active photo
  const unitPrice = Math.round(selectedSize.basePrice * selectedType.priceMultiplier);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeCheckout();
    };
    if (checkoutPhoto) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [checkoutPhoto, closeCheckout]);

  // Prevent background scroll when modal is active
  useEffect(() => {
    if (checkoutPhoto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [checkoutPhoto]);

  if (!checkoutPhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs transition-opacity duration-300 flex items-center justify-center p-2 sm:p-6"
      onClick={closeCheckout}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-6xl rounded-xl bg-white text-gray-900 shadow-2xl border border-gray-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar with Navigation */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3.5 bg-gray-50/70 shrink-0">
          <button
            type="button"
            onClick={closeCheckout}
            className="group flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-orange-600 transition cursor-pointer"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Back to gallery</span>
          </button>

          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            PicsEra Studio
          </span>

          <button
            type="button"
            onClick={closeCheckout}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 sm:p-10 flex-1">
          {/* Main 2-Column Configurator Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Realistic Artwork Presentation with multi-item switch arrows */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-md flex items-center justify-center">
                {/* Left Arrow (only shown if there are multiple items in cart) */}
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevItem}
                    className="absolute -left-4 sm:-left-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-800 hover:text-orange-600 hover:border-orange-400 hover:shadow-xl transition cursor-pointer active:scale-90"
                    title="Previous photo in cart"
                    aria-label="Previous item"
                  >
                    <span className="text-2xl font-bold leading-none select-none">‹</span>
                  </button>
                )}

                {/* Framed Artwork Display */}
                <div
                  className={`w-full aspect-[4/5] flex items-center justify-center transition-all duration-300 ${
                    selectedType.id === "framed_print"
                      ? "border-[16px] border-[#18181b] bg-[#faf8f5] p-6 shadow-2xl rounded-xs"
                      : selectedType.id === "framed_canvas"
                      ? "border-[12px] border-[#27272a] bg-[#121212] p-2 shadow-2xl rounded-xs"
                      : "border border-gray-200 shadow-2xl rounded-xs"
                  }`}
                >
                  <div className="relative w-full h-full overflow-hidden bg-gray-100 shadow-inner">
                    <img
                      src={activePhoto.image}
                      alt={activePhoto.title}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Right Arrow (only shown if there are multiple items in cart) */}
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={handleNextItem}
                    className="absolute -right-4 sm:-right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-800 hover:text-orange-600 hover:border-orange-400 hover:shadow-xl transition cursor-pointer active:scale-90"
                    title="Next photo in cart"
                    aria-label="Next item"
                  >
                    <span className="text-2xl font-bold leading-none select-none">›</span>
                  </button>
                )}
              </div>

              {/* Dots & Item Counter (only shown if multiple items exist) */}
              {items.length > 1 && (
                <div className="mt-5 flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-2">
                    {items.map((item, idx) => (
                      <button
                        key={item.id || idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                          idx === safeIndex
                            ? "w-6 bg-orange-600 shadow-xs"
                            : "w-2 bg-gray-300 hover:bg-gray-400"
                        }`}
                        title={`View ${item.title}`}
                        aria-label={`View item ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    Item {safeIndex + 1} of {items.length} in cart
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: Clean White Product Detail & Configurator */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Product Title Header Bar with brand accent */}
              <div className="bg-gray-900 border-t-2 border-orange-600 text-white py-2.5 px-4 text-center font-bold tracking-widest uppercase text-base sm:text-lg rounded-t-sm shadow-xs">
                {activePhoto.title}
              </div>

              {/* Price & Artist Details Box */}
              <div className="border-x border-b border-gray-200 p-6 bg-white space-y-5">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                      ${unitPrice}.00
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-orange-600 font-bold">▸</span>
                      <span className="font-semibold text-gray-800">ARTIST:</span>
                      <span className="uppercase">{activePhoto.photographer || "PicsEra Artist"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-orange-600 font-bold">▸</span>
                      <span className="font-semibold text-gray-800">PRODUCT CODE:</span>
                      <span>20037{activePhoto.id}</span>
                    </div>
                  </div>
                </div>

                {/* CHOOSE PRODUCT TYPE: ★ */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-2.5">
                    CHOOSE PRODUCT TYPE: <span className="text-orange-600">★</span>
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {PRODUCT_TYPES.map((type) => {
                      const isSelected = selectedType.id === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleSelectType(type)}
                          className={`flex flex-col items-center justify-between p-2 rounded-sm border transition-all cursor-pointer ${
                            isSelected
                              ? "border-orange-600 ring-1 ring-orange-600 bg-orange-50/20 shadow-xs"
                              : "border-gray-300 hover:border-gray-400 bg-white"
                          }`}
                        >
                          {/* Mini Thumbnail */}
                          <div
                            className={`w-16 h-20 overflow-hidden bg-gray-100 my-1 ${
                              type.id === "framed_print"
                                ? "border-4 border-black p-0.5 bg-white shadow-xs"
                                : type.id === "framed_canvas"
                                ? "border-2 border-neutral-700 shadow-xs"
                                : "shadow-xs"
                            }`}
                          >
                            <img
                              src={activePhoto.image}
                              alt={type.label}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span
                            className={`mt-2 text-[10px] font-bold uppercase text-center leading-tight ${
                              isSelected ? "text-orange-600" : "text-gray-700"
                            }`}
                          >
                            {type.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FRAMED CANVAS SIZE (or Selected Type Size) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-2.5">
                    {selectedType.label} SIZE:
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => {
                      const isSelected = selectedSize.id === size.id;
                      return (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => handleSelectSize(size)}
                          className={`py-2 px-3 text-xs font-semibold rounded-xs border transition-all cursor-pointer ${
                            isSelected
                              ? "border-orange-600 bg-orange-600 text-white shadow-xs"
                              : "border-gray-300 bg-white text-gray-800 hover:border-orange-300 hover:text-orange-600"
                          }`}
                        >
                          {size.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity & Update Cart Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between border border-gray-300 bg-white rounded-xs px-2 py-1.5 w-24 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-2 py-0.5 text-sm font-bold text-gray-600 hover:text-orange-600 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="text-xs font-bold text-gray-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-2 py-0.5 text-sm font-bold text-gray-600 hover:text-orange-600 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* UPDATE CART Button (replaces Buy Now in configurator) */}
                  <button
                    type="button"
                    onClick={handleUpdateCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-md text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xs transition cursor-pointer active:scale-95 ${
                      updateSuccess
                        ? "bg-emerald-600 text-white"
                        : "bg-orange-600 hover:bg-orange-700 text-white"
                    }`}
                  >
                    <span>{updateSuccess ? "✓" : "🛒"}</span>
                    <span>{updateSuccess ? "Cart Updated!" : "Update Cart"}</span>
                  </button>
                </div>

                {/* Fully Justified Horizontal Star Rating & Wishlist Row */}
                <div className="pt-3.5 border-t border-gray-100 flex flex-row items-center justify-between gap-2 flex-nowrap text-xs">
                  <div className="flex flex-row items-center gap-2 flex-nowrap shrink-0">
                    {/* Fixed Rating Badge */}
                    <span className="rounded-full bg-orange-50 border border-orange-200 px-2 py-0.5 text-xs font-bold text-orange-700 shadow-2xs whitespace-nowrap shrink-0">
                      ★ {(activePhoto.rating || 5.0).toFixed(1)}
                    </span>

                    {/* Rate this photo label */}
                    <span className="text-xs font-medium text-gray-600 whitespace-nowrap shrink-0">
                      Rate this photo:
                    </span>

                    {/* 5 Stars in single row */}
                    <div className="flex flex-row items-center gap-0.5 flex-nowrap shrink-0">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRate(star)}
                          className={`inline-flex items-center justify-center text-lg leading-none transition-transform hover:scale-125 active:scale-95 cursor-pointer p-0.5 shrink-0 ${
                            star <= (userRatings[activePhoto.id] || 0)
                              ? "text-yellow-400"
                              : "text-gray-300 hover:text-yellow-300"
                          }`}
                          aria-label={`Rate ${star} out of 5`}
                        >
                          ★
                        </button>
                      ))}

                      {(userRatings[activePhoto.id] || 0) > 0 && (
                        <span className="ml-1 text-xs font-bold text-orange-600 whitespace-nowrap shrink-0">
                          {userRatings[activePhoto.id]}/5
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => toggleSavePhoto(activePhoto.id)}
                    className="flex flex-row items-center gap-1.5 text-gray-700 hover:text-orange-600 transition cursor-pointer font-medium whitespace-nowrap shrink-0"
                  >
                    <span>{isSaved ? "❤️" : "🤍"}</span>
                    <span className={isSaved ? "font-bold text-red-600" : ""}>
                      {isSaved ? "Saved" : "Save"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Cart Items Review Section with Buy Now Button */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                  <span>Order Summary</span>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-0.5">
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Review your configured archival prints below with selected product type and size
                </p>
              </div>
            </div>

            {/* List of all added items with details */}
            <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-gray-50/50 overflow-hidden shadow-2xs">
              {items.map((photo, idx) => {
                const cfg =
                  itemConfigs[photo.id] || {
                    productTypeId: "framed_canvas",
                    sizeId: "small",
                    quantity: 1,
                  };
                const pType =
                  PRODUCT_TYPES.find((t) => t.id === cfg.productTypeId) || PRODUCT_TYPES[0];
                const pSize =
                  SIZES.find((s) => s.id === cfg.sizeId) || SIZES[0];
                const pQty = cfg.quantity || 1;
                const pUnitPrice = Math.round(pSize.basePrice * pType.priceMultiplier);
                const pItemTotal = pUnitPrice * pQty;
                const isCurrent = idx === safeIndex;

                return (
                  <div
                    key={photo.id || idx}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 transition ${
                      isCurrent
                        ? "bg-orange-50/50 ring-1 ring-inset ring-orange-200"
                        : "hover:bg-white"
                    }`}
                  >
                    {/* Thumbnail & Title/Artist */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        onClick={() => setCurrentIndex(idx)}
                        className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-lg overflow-hidden border border-gray-200 cursor-pointer shadow-2xs group"
                        title="Click to configure this print above"
                      >
                        <img
                          src={photo.image}
                          alt={photo.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {isCurrent && (
                          <span className="absolute inset-0 bg-orange-600/15 border-2 border-orange-600 rounded-lg pointer-events-none" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4
                            onClick={() => setCurrentIndex(idx)}
                            className="font-bold text-gray-900 truncate text-sm sm:text-base cursor-pointer hover:text-orange-600 transition"
                          >
                            {photo.title}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full uppercase shrink-0">
                              Configuring Above
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Artist: {photo.photographer || "PicsEra Artist"} · Code: 20037{photo.id}
                        </p>

                        {/* Selected PRODUCT TYPE: and selected FRAMED PRINT SIZE: Details */}
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 font-semibold text-gray-800 border border-gray-200 shadow-2xs">
                            <span className="text-gray-400 font-normal">PRODUCT TYPE:</span>
                            <span className="text-orange-600 font-bold">{pType.label}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 font-semibold text-gray-800 border border-gray-200 shadow-2xs">
                            <span className="text-gray-400 font-normal">FRAMED PRINT SIZE:</span>
                            <span className="text-gray-900 font-bold">{pSize.label}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 font-semibold text-gray-700 border border-gray-200 shadow-2xs">
                            <span className="text-gray-400 font-normal">Qty:</span>
                            <span className="font-bold text-gray-900">{pQty}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Item Total & Edit Config Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                      <div className="text-left sm:text-right">
                        <span className="text-base sm:text-lg font-extrabold text-gray-900">
                          ${pItemTotal}.00
                        </span>
                        <p className="text-[11px] text-gray-400">
                          ${pUnitPrice}.00 each
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`text-xs font-semibold px-3 py-1 rounded-md transition cursor-pointer ${
                          isCurrent
                            ? "text-orange-700 bg-orange-100 font-bold"
                            : "text-gray-600 hover:text-orange-600 hover:bg-gray-100"
                        }`}
                      >
                        {isCurrent ? "Configuring ↑" : "Edit Config ↑"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Amount to be Paid & BUY NOW Button on same page */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-orange-200 bg-orange-50/60 p-6 shadow-xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Total Amount to be Paid
                </span>
                <div className="text-3xl font-black text-gray-900 tracking-tight">
                  ${totalOrderAmount}.00
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ready to hang fine-art prints with museum-grade archival quality
                </p>
              </div>

              <div>
                <button
                  type="button"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 rounded-lg text-sm sm:text-base font-bold uppercase tracking-wider bg-orange-600 hover:bg-orange-700 text-white shadow-md transition cursor-pointer active:scale-95"
                >
                  <span>💳</span>
                  <span>Buy Now (${totalOrderAmount}.00)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom 3 Feature Cards */}
          <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">🚚</span>
              <div>
                <h4 className="font-bold uppercase tracking-wider text-gray-900">
                  Delivery in 2-3 Working Days
                </h4>
                <p className="mt-1 text-gray-500 leading-relaxed">
                  Our standard delivery times are 2-3 working days from placing your order.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">🖼️</span>
              <div>
                <h4 className="font-bold uppercase tracking-wider text-gray-900">
                  Delivered Ready to Hang
                </h4>
                <p className="mt-1 text-gray-500 leading-relaxed">
                  All our items are delivered ready to hang without the need for any further assembly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">🎨</span>
              <div>
                <h4 className="font-bold uppercase tracking-wider text-gray-900">
                  Our Frames
                </h4>
                <p className="mt-1 text-gray-500 leading-relaxed">
                  Premium archival solid wood frames, museum mat board, and UV-filtering acrylic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
