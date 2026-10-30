import { useAuth } from "../context/useAuth.js";

function CartModal() {
  const {
    isCartModalOpen,
    closeCartModal,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    openCheckout,
  } = useAuth();

  if (!isCartModalOpen) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const basePricePerPrint = 56; // Default price for FRAMED CANVAS Small
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * (item.unitPrice || basePricePerPrint),
    0
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-300"
      onClick={closeCartModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white text-gray-900 border border-gray-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-lg">
              🛒
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">
                  Your Shopping Cart
                </h2>
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                All items curated from PicsEra fine art collection
              </p>
            </div>
          </div>
          <button
            onClick={closeCartModal}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer"
            aria-label="Close cart dialog"
          >
            ✕
          </button>
        </div>

        {/* Content: shows all items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <span className="text-5xl">🛒</span>
              <h3 className="mt-4 text-base font-semibold text-gray-800">
                Your cart is empty
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                Explore our curated portfolio and click "Add to Cart" on photographs to add them here.
              </p>
              <button
                type="button"
                onClick={closeCartModal}
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700 transition cursor-pointer shadow-xs"
              >
                <span>Browse Gallery</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const itemPrice = item.unitPrice || basePricePerPrint;
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div
                    key={item.photoId}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4 transition hover:border-gray-300 hover:bg-white hover:shadow-xs"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.photo.image}
                      alt={item.photo.title}
                      className="h-20 w-20 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-90 transition shrink-0"
                      onClick={() => {
                        closeCartModal();
                        openCheckout(item.photo);
                      }}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4
                            className="font-bold text-gray-900 truncate cursor-pointer hover:text-orange-600 transition text-base"
                            onClick={() => {
                              closeCartModal();
                              openCheckout(item.photo);
                            }}
                          >
                            {item.photo.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {item.configuredType?.label || "FRAMED CANVAS"} · {item.configuredSize?.label || "Small 30 × 40 cm"}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">
                            ${itemTotal.toFixed(2)}
                          </span>
                          <p className="text-[11px] text-gray-400">
                            ${itemPrice.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Quantity Stepper */}
                          <div className="flex items-center rounded-lg border border-gray-300 bg-white shadow-2xs">
                            <button
                              type="button"
                              onClick={() =>
                                updateCartQuantity(item.photoId, item.quantity - 1)
                              }
                              className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-l-lg cursor-pointer"
                              title="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="px-3 py-1 text-xs font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateCartQuantity(item.photoId, item.quantity + 1)
                              }
                              className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-r-lg cursor-pointer"
                              title="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.photoId)}
                            className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            closeCartModal();
                            openCheckout(item.photo);
                          }}
                          className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                        >
                          Customize Print →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50/90 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs text-gray-500">
                Subtotal ({totalItems} {totalItems === 1 ? "print" : "prints"}):
              </div>
              <div className="text-xl font-bold text-gray-900">
                ${subtotal.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearCart}
                className="rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer shadow-2xs transition"
              >
                Clear Cart
              </button>

              <button
                type="button"
                onClick={() => {
                  closeCartModal();
                  openCheckout(cart[0]?.photo);
                }}
                className="rounded-lg bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700 cursor-pointer transition flex items-center gap-1.5"
              >
                <span>Proceed to Checkout →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartModal;
