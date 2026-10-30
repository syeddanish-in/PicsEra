import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth.js";
import { PHOTOS } from "../data/photo.js";

const SIZES = [
  { id: "8x12", label: "8 × 12 in", price: 35 },
  { id: "12x18", label: "12 × 18 in", price: 65 },
  { id: "16x24", label: "16 × 24 in", price: 110 },
  { id: "24x36", label: "24 × 36 in", price: 190 },
];

const FRAMES = [
  {
    id: "none",
    label: "No frame",
    price: 0,
    priceLabel: "Included",
    description: "Print only, rolled in a protective tube.",
  },
  {
    id: "black_wood",
    label: "Black wood",
    price: 60,
    priceLabel: "+$60.00",
    description: "Solid black wood frame with a white mat.",
  },
  {
    id: "natural_wood",
    label: "Natural wood",
    price: 60,
    priceLabel: "+$60.00",
    description: "Light oak frame with a white mat.",
  },
  {
    id: "glass_front",
    label: "Glass front",
    price: 95,
    priceLabel: "+$95.00",
    description: "Slim metal frame with museum-grade glass.",
  },
  {
    id: "acrylic",
    label: "Acrylic",
    price: 120,
    priceLabel: "+$120.00",
    description: "Print face-mounted behind polished acrylic.",
  },
  {
    id: "table_stand",
    label: "Table stand",
    price: 25,
    priceLabel: "+$25.00",
    description: "Mounted on rigid board with a tabletop easel stand.",
  },
];

const FINISHES = [
  {
    id: "matte",
    label: "Matte",
    price: 0,
    priceLabel: "Included",
    description: "Soft, glare-free finish.",
  },
  {
    id: "gloss",
    label: "Gloss",
    price: 10,
    priceLabel: "+$10.00",
    description: "High-contrast finish with deeper blacks.",
  },
];

export default function CheckoutPage() {
  const {
    checkoutPhoto,
    closeCheckout,
    addToCart,
    currentUser,
    openAuthModal,
    cart,
  } = useAuth();

  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0]);
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0]);
  const [quantity, setQuantity] = useState(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Active photograph to display and configure
  const activePhoto = checkoutPhoto || cart[0]?.photo || PHOTOS[0];

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeCheckout();
      }
    };
    if (checkoutPhoto) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [checkoutPhoto, closeCheckout]);

  if (!checkoutPhoto) return null;

  // Real-time calculations
  const basePrice = selectedSize.price;
  const framePrice = selectedFrame.price;
  const finishPrice = selectedFinish.price;
  const unitPrice = basePrice + framePrice + finishPrice;
  const totalPrice = unitPrice * quantity;

  const handleBuyNow = () => {
    if (!currentUser) {
      openAuthModal("signin", "Please sign in to proceed with your print order!");
      return;
    }

    // Save customized item to cart
    addToCart(
      {
        ...activePhoto,
        configuredSize: selectedSize.label,
        configuredFrame: selectedFrame.label,
        configuredFinish: selectedFinish.label,
        unitPrice,
      },
      quantity
    );

    setOrderConfirmed(true);
    setTimeout(() => {
      setOrderConfirmed(false);
    }, 3500);
  };

  // Determine realistic framing mat effect based on selected frame
  const getFrameStyle = () => {
    switch (selectedFrame.id) {
      case "black_wood":
        return "border-[12px] border-neutral-900 shadow-2xl";
      case "natural_wood":
        return "border-[12px] border-[#c69a68] shadow-2xl";
      case "glass_front":
        return "border-[6px] border-zinc-400 shadow-2xl ring-1 ring-white/40";
      case "acrylic":
        return "border-[3px] border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xs";
      case "table_stand":
        return "border-[4px] border-neutral-300 shadow-xl";
      default:
        return "shadow-xl";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0e1116] text-gray-200 antialiased selection:bg-orange-500 selection:text-white"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Navigation: Back to Gallery */}
        <div className="mb-8 flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <button
            type="button"
            onClick={closeCheckout}
            className="group flex items-center gap-2 text-sm font-semibold text-orange-500 transition hover:text-orange-400 cursor-pointer"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            <span>Back to the gallery</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PicsEra Fine Art Print Studio</span>
          </div>
        </div>

        {/* Main Grid: Artwork on Left, Configurator on Right */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          {/* LEFT COLUMN: Gallery Framed Photo & Fine-Art Specifications */}
          <div className="lg:col-span-6 space-y-8">
            {/* Museum-Grade Mat & Frame Presentation */}
            <div className="rounded-xl bg-[#e6e2d8] p-8 sm:p-12 shadow-2xl flex items-center justify-center transition-all duration-300">
              <div
                className={`overflow-hidden transition-all duration-300 ${getFrameStyle()}`}
              >
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="max-h-[460px] w-full object-cover shadow-inner"
                />
              </div>
            </div>

            {/* Photo Title & Location Description */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {activePhoto.title}
              </h1>

              <p className="mt-1.5 text-sm font-semibold text-orange-500">
                {activePhoto.category} Collection · Certified Archival Print
              </p>

              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                {activePhoto.description}
              </p>

              {/* Archival Quality Bullet Points */}
              <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-gray-300 border-t border-neutral-800/80 pt-6">
                <li className="flex items-start gap-2.5">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Archival pigment print on museum-grade fine art paper</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Printed to order and signed on the back by the photographer</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Ships worldwide in 5 to 10 business days</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>30-day returns if it arrives damaged</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Configuration & Checkout Panel */}
          <div className="lg:col-span-6 space-y-8">
            {/* 1. SIZE SELECTOR */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                SIZE
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {SIZES.map((size) => {
                  const isSelected = selectedSize.id === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`flex items-center justify-between rounded-lg border p-3.5 text-left transition cursor-pointer ${
                        isSelected
                          ? "border-orange-500 bg-orange-950/20 text-white shadow-xs ring-1 ring-orange-500/60"
                          : "border-neutral-800 bg-neutral-900/60 text-gray-300 hover:border-neutral-700 hover:bg-neutral-900"
                      }`}
                    >
                      <span className="text-sm font-semibold">{size.label}</span>
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? "text-orange-400" : "text-gray-400"
                        }`}
                      >
                        ${size.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. FRAME SELECTOR */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                FRAME
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FRAMES.map((frame) => {
                  const isSelected = selectedFrame.id === frame.id;
                  return (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => setSelectedFrame(frame)}
                      className={`flex flex-col justify-between rounded-lg border p-3.5 text-left transition cursor-pointer ${
                        isSelected
                          ? "border-orange-500 bg-orange-950/20 shadow-xs ring-1 ring-orange-500/60"
                          : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-semibold text-white">
                          {frame.label}
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            isSelected ? "text-orange-400" : "text-gray-400"
                          }`}
                        >
                          {frame.priceLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                        {frame.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. FINISH SELECTOR */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                FINISH
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FINISHES.map((finish) => {
                  const isSelected = selectedFinish.id === finish.id;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      onClick={() => setSelectedFinish(finish)}
                      className={`flex flex-col justify-between rounded-lg border p-3.5 text-left transition cursor-pointer ${
                        isSelected
                          ? "border-orange-500 bg-orange-950/20 shadow-xs ring-1 ring-orange-500/60"
                          : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-semibold text-white">
                          {finish.label}
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            isSelected ? "text-orange-400" : "text-gray-400"
                          }`}
                        >
                          {finish.priceLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        {finish.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. SUMMARY & BUY NOW CARD */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/90 p-5 space-y-4 shadow-xl">
              {/* Itemized Line Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-300">
                  <span>{selectedSize.label}</span>
                  <span className="font-semibold text-white">
                    ${selectedSize.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>{selectedFrame.label}</span>
                  <span className="font-semibold text-white">
                    ${selectedFrame.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>{selectedFinish.label} finish</span>
                  <span className="font-semibold text-white">
                    ${selectedFinish.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Quantity Stepper & Total */}
              <div className="border-t border-neutral-800 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-gray-400">Qty</span>
                  <div className="flex items-center rounded-lg border border-neutral-700 bg-neutral-800">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-1 text-sm font-bold text-gray-300 hover:bg-neutral-700 disabled:opacity-30 cursor-pointer rounded-l-lg transition"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-white min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-sm font-bold text-gray-300 hover:bg-neutral-700 cursor-pointer rounded-r-lg transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-2xl font-extrabold text-white">
                  ${totalPrice.toFixed(2)}
                </div>
              </div>

              {/* Order Feedback Alert */}
              {orderConfirmed && (
                <div className="rounded-lg bg-emerald-950/80 border border-emerald-500/50 p-3 text-center text-xs font-semibold text-emerald-300 animate-fade-in">
                  ✓ Print added to order! Configuration saved. Ready for Stripe Checkout.
                </div>
              )}

              {/* Buy Now Button in PicsEra Brand Orange */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full rounded-lg bg-orange-600 hover:bg-orange-500 active:scale-[0.99] text-white font-bold py-3.5 text-base shadow-lg shadow-orange-600/30 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Buy now</span>
                <span>→</span>
              </button>

              {/* Secure Stripe Notice */}
              <p className="text-center text-[11px] text-gray-400">
                Secure payment by Stripe. Shipping address is collected at checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
