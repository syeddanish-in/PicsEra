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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 transition-all duration-300"
      onClick={closeCartModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-[#11141a] text-gray-200 border border-neutral-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/60 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <div>
              <h2 className="text-lg font-bold text-white">
                Archival Print Cart
              </h2>
              <p className="text-xs text-gray-400">
                Selected fine art photographs ready for museum-grade printing
              </p>
            </div>
          </div>
          <button
            onClick={closeCartModal}
            className="rounded-lg p-2 text-gray-400 hover:bg-neutral-800 hover:text-white transition cursor-pointer"
            aria-label="Close cart dialog"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <span className="text-5xl">🛒</span>
              <h3 className="mt-4 text-base font-semibold text-gray-300">
                Your cart is empty
              </h3>
              <p className="mt-1 text-sm text-gray-400 max-w-sm mx-auto">
                Explore our curated portfolio and click "Buy Print" on any photograph to customize your print size, frame, and finish.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.photoId}
                  className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 p-3.5 transition hover:border-neutral-700"
                >
                  <img
                    src={item.photo.image}
                    alt={item.photo.title}
                    className="h-20 w-20 rounded-lg object-cover border border-neutral-800 cursor-pointer hover:opacity-90 transition"
                    onClick={() => {
                      closeCartModal();
                      openCheckout(item.photo);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      className="font-semibold text-white truncate cursor-pointer hover:text-orange-400 transition"
                      onClick={() => {
                        closeCartModal();
                        openCheckout(item.photo);
                      }}
                    >
                      {item.photo.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {item.photo.category} · Archival Pigment Print
                    </p>

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-md border border-neutral-700 bg-neutral-800">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.photoId, item.quantity - 1)}
                            className="px-2.5 py-0.5 text-sm font-bold text-gray-300 hover:bg-neutral-700 cursor-pointer"
                          >
                            −
                          </button>
                          <span className="px-3 py-0.5 text-xs font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.photoId, item.quantity + 1)}
                            className="px-2.5 py-0.5 text-sm font-bold text-gray-300 hover:bg-neutral-700 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.photoId)}
                          className="text-xs text-red-400 hover:underline cursor-pointer"
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
                        className="rounded-md bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white px-2.5 py-1 text-xs font-semibold transition cursor-pointer border border-orange-500/30"
                      >
                        Customize & Buy →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-neutral-800 bg-neutral-900/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-medium text-gray-300">
              Total Prints: <span className="font-bold text-orange-400">{totalItems}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearCart}
                className="rounded-lg border border-neutral-700 px-3 py-2 text-xs font-semibold text-gray-400 hover:bg-neutral-800 hover:text-white cursor-pointer"
              >
                Clear Cart
              </button>
              <button
                type="button"
                onClick={() => {
                  closeCartModal();
                  openCheckout(cart[0]?.photo);
                }}
                className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-orange-500 cursor-pointer transition"
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartModal;
