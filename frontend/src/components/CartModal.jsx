import { useAuth } from "../context/useAuth.js";

function CartModal() {
  const {
    isCartModalOpen,
    closeCartModal,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useAuth();

  if (!isCartModalOpen) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-300"
      onClick={closeCartModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Your Cart
              </h2>
              <p className="text-xs text-gray-500">
                Photos saved for future reference & shoot booking
              </p>
            </div>
          </div>
          <button
            onClick={closeCartModal}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer"
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
              <h3 className="mt-4 text-base font-semibold text-gray-700">
                Your cart is empty
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Browse our curated portfolio and click "Add to Cart" to store photos for reference.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.photoId}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 p-3 transition hover:shadow-xs"
                >
                  <img
                    src={item.photo.image}
                    alt={item.photo.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {item.photo.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {item.photo.category} · Archival Print Available
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-md border border-gray-300">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.photoId, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-sm font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          −
                        </button>
                        <span className="px-3 py-0.5 text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.photoId, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-sm font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.photoId)}
                        className="text-xs text-red-500 hover:underline cursor-pointer"
                      >
                        Remove
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
          <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-medium text-gray-700">
              Total Items: <span className="font-bold text-orange-600">{totalItems}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearCart}
                className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Clear Cart
              </button>
              <a
                href="#contact"
                onClick={closeCartModal}
                className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-orange-700 cursor-pointer"
              >
                Proceed to Book
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartModal;
