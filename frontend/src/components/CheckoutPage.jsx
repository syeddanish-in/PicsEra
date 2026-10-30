import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth.js";
import { PHOTOS } from "../data/photo.js";

const PRODUCT_TYPES = [
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
  {
    id: "framed_canvas",
    label: "FRAMED CANVAS",
    description: "Gallery wrap with floating shadowbox frame",
    priceMultiplier: 1.25,
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
    addToCart,
    currentUser,
    openAuthModal,
    isPhotoSaved,
    toggleSavePhoto,
    cart,
  } = useAuth();

  const [selectedType, setSelectedType] = useState(PRODUCT_TYPES[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[4]); // Defaults to Extra Large as in reference image ($185)
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [buyNowModal, setBuyNowModal] = useState(false);

  // Active photograph to display and configure
  const activePhoto = checkoutPhoto || cart[0]?.photo || PHOTOS[0];
  const isSaved = activePhoto ? isPhotoSaved(activePhoto.id) : false;

  // Calculate dynamic unit price and subtotal
  const unitPrice = Math.round(selectedSize.basePrice * selectedType.priceMultiplier);
  const totalPrice = unitPrice * quantity;
  const installment = (unitPrice / 4).toFixed(2);

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

  const handleAddToCart = () => {
    if (!currentUser) {
      openAuthModal("signin", "Please sign in to add this customized print to your cart!");
      return;
    }
    const customItem = {
      ...activePhoto,
      title: `${activePhoto.title} (${selectedType.label} - ${selectedSize.label})`,
    };
    addToCart(customItem, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2200);
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      openAuthModal("signin", "Please sign in to proceed with your order!");
      return;
    }
    setBuyNowModal(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs transition-opacity duration-300 flex items-center justify-center p-2 sm:p-6"
      onClick={closeCheckout}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-6xl rounded-xl bg-white text-gray-900 shadow-2xl border border-gray-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar with Navigation */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3.5 bg-gray-50/70">
          <button
            type="button"
            onClick={closeCheckout}
            className="group flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-orange-600 transition cursor-pointer"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Back to gallery</span>
          </button>

          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Fine Art Print Studio
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

        {/* Main 2-Column Content */}
        <div className="p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Realistic Artwork Presentation matching uploaded UI */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full max-w-md flex flex-col items-center">
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

                {/* Carousel Pagination Dots underneath (as in reference UI) */}
                <div className="mt-6 flex items-center gap-1.5">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((dot, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        idx === 4
                          ? "w-4 bg-red-600"
                          : "w-1.5 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Clean White Product Detail & Configurator */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Product Title Header Bar */}
              <div className="bg-[#242424] text-white py-2.5 px-4 text-center font-bold tracking-widest uppercase text-base sm:text-lg rounded-t-sm shadow-xs">
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
                      <span className="text-emerald-600 font-bold">▸</span>
                      <span className="font-semibold text-gray-800">ARTIST:</span>
                      <span className="uppercase">{activePhoto.photographer || "PicsEra Artist"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-600 font-bold">▸</span>
                      <span className="font-semibold text-gray-800">PRODUCT CODE:</span>
                      <span>20037{activePhoto.id}</span>
                    </div>
                  </div>
                </div>

                {/* Installment Badge Banner */}
                <div className="flex items-center justify-between rounded-sm border border-gray-200 bg-gray-50/60 px-3.5 py-2 text-xs text-gray-700">
                  <span>
                    As low as <strong>${installment}/month</strong> or 4 interest-free payments.{" "}
                    <button type="button" className="underline text-gray-900 font-medium hover:text-orange-600 cursor-pointer">
                      Learn more
                    </button>
                  </span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Tabby / Stripe
                  </span>
                </div>

                {/* CHOOSE PRODUCT TYPE: ★ */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 mb-2.5">
                    CHOOSE PRODUCT TYPE: <span className="text-red-600">★</span>
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {PRODUCT_TYPES.map((type) => {
                      const isSelected = selectedType.id === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedType(type)}
                          className={`flex flex-col items-center justify-between p-2 rounded-sm border transition-all cursor-pointer ${
                            isSelected
                              ? "border-red-600 ring-1 ring-red-600 bg-red-50/20 shadow-xs"
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
                              isSelected ? "text-red-700" : "text-gray-700"
                            }`}
                          >
                            {type.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FRAMED PRINT SIZE */}
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
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 px-3 text-xs font-semibold rounded-xs border transition-all cursor-pointer ${
                            isSelected
                              ? "border-black bg-gray-900 text-white shadow-xs"
                              : "border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50"
                          }`}
                        >
                          {size.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity & Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between border border-gray-300 bg-white rounded-xs px-2 py-1.5 w-24 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-2 py-0.5 text-sm font-bold text-gray-600 hover:text-black cursor-pointer"
                    >
                      −
                    </button>
                    <span className="text-xs font-bold text-gray-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-2 py-0.5 text-sm font-bold text-gray-600 hover:text-black cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* ADD TO CART Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xs text-xs font-bold uppercase tracking-wider shadow-xs transition cursor-pointer active:scale-95 ${
                      addedSuccess
                        ? "bg-emerald-600 text-white"
                        : "bg-[#2b3542] hover:bg-[#1f2630] text-white"
                    }`}
                  >
                    <span>{addedSuccess ? "✓" : "🛒"}</span>
                    <span>{addedSuccess ? "Added to Cart!" : "Add to Cart"}</span>
                  </button>

                  {/* BUY NOW Button */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xs text-xs font-bold uppercase tracking-wider bg-[#1c1c1c] hover:bg-black text-white shadow-xs transition cursor-pointer active:scale-95"
                  >
                    <span>💳</span>
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* Wishlist & Reviews Row */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleSavePhoto(activePhoto.id)}
                    className="flex items-center gap-1.5 text-gray-700 hover:text-red-600 transition cursor-pointer font-medium"
                  >
                    <span>{isSaved ? "❤️" : "♡"}</span>
                    <span>{isSaved ? "SAVED TO WISH LIST" : "ADD TO WISH LIST"}</span>
                  </button>

                  <div className="text-gray-500">
                    <span className="text-amber-500 font-bold">★★★★★</span> Based on reviews ·{" "}
                    <button type="button" className="underline hover:text-gray-900 cursor-pointer">
                      Write a review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 4 Feature Cards matching the reference design */}
          <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-gray-700">
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
              <span className="text-2xl shrink-0">📏</span>
              <div>
                <h4 className="font-bold uppercase tracking-wider text-gray-900">
                  Size Guide
                </h4>
                <p className="mt-1 text-gray-500 leading-relaxed">
                  Need help choosing the correct size for your walls? View our standard size guide.
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

        {/* Buy Now Modal / Confirmation (waiting for Stripe instructions) */}
        {buyNowModal && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            onClick={() => setBuyNowModal(false)}
          >
            <div
              className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl">
                ✓
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                Order Configuration Ready
              </h3>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                Selected: <strong>{activePhoto.title}</strong>
                <br />
                Type: <strong>{selectedType.label}</strong> ({selectedSize.label})
                <br />
                Quantity: <strong>{quantity}</strong> · Total: <strong>${totalPrice}.00</strong>
              </p>
              <div className="mt-3 rounded-lg bg-orange-50 p-3 text-xs text-orange-800 border border-orange-200 text-left">
                Stripe payment integration is ready to be connected per your instructions.
              </div>
              <button
                type="button"
                onClick={() => setBuyNowModal(false)}
                className="mt-5 w-full rounded-lg bg-[#242424] hover:bg-black py-2.5 text-xs font-bold text-white transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
