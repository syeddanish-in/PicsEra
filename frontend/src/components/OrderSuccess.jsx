import { useState, useEffect, useRef } from "react";
import { api } from "../api.js";
import { useAuth } from "../context/useAuth.js";

// Helper: Formats currency to show up to 2 decimals if available (e.g. $41.50), otherwise whole number (e.g. $41)
const formatAmount = (val) => {
  if (val === null || val === undefined || val === "") return "$0";
  const num = typeof val === "number" ? val : parseFloat(val);
  if (isNaN(num)) return "$0";
  if (num % 1 !== 0) {
    return `$${num.toFixed(2)}`;
  }
  return `$${Math.round(num)}`;
};

export default function OrderSuccess({ onReturnHome }) {
  const { clearCart, closeCheckout } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pollCount, setPollCount] = useState(0);
  const cartClearedRef = useRef(false);

  // Parse parameters from URL
  const queryParams = new URLSearchParams(window.location.search);
  const sessionId = queryParams.get("session_id");
  const orderId = queryParams.get("order_id");

  useEffect(() => {
    let timerId;
    let isCancelled = false;

    const fetchOrderStatus = async () => {
      try {
        let result = null;

        if (orderId) {
          try {
            result = await api.getOrder(orderId);
          } catch (fetchErr) {
            // Fallback to session verification if order route requires specific auth
            if (sessionId) {
              result = await api.verifySession(sessionId);
            } else {
              throw fetchErr;
            }
          }
        } else if (sessionId) {
          result = await api.verifySession(sessionId);
        }

        if (isCancelled) return;

        if (result && result.order) {
          setOrder(result.order);
          setLoading(false);

          // Clear cart upon confirmed order
          if (!cartClearedRef.current) {
            cartClearedRef.current = true;
            clearCart();
            closeCheckout();
          }

          // If still pending, poll a couple of times for webhook arrival
          if (result.order.status === "pending" && pollCount < 5) {
            timerId = setTimeout(() => {
              setPollCount((prev) => prev + 1);
            }, 2000);
          }
        } else {
          setError("Order details could not be retrieved.");
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Order lookup failed:", err);
          setError(err.message || "Failed to load order confirmation.");
          setLoading(false);
        }
      }
    };

    fetchOrderStatus();

    return () => {
      isCancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [orderId, sessionId, pollCount, clearCart, closeCheckout]);

  const handleReturnToGallery = () => {
    // Clear URL query parameters cleanly without reload
    window.history.replaceState({}, document.title, window.location.pathname.replace(/\/order\/success.*/, "") || "/");
    if (onReturnHome) {
      onReturnHome();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* Print-specific CSS ensuring single A4 page receipt with no header/footer */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }

          /* Hide header, footer, navigation and non-printable elements */
          header,
          footer,
          nav,
          .no-print {
            display: none !important;
          }

          body {
            background: #ffffff !important;
            color: #111827 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-receipt-wrapper {
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
            background: transparent !important;
          }

          .receipt-container {
            border: 1px solid #e5e7eb !important;
            box-shadow: none !important;
            border-radius: 8px !important;
            width: 100% !important;
            max-width: 100% !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            overflow: hidden !important;
          }

          .receipt-header-banner {
            padding: 14px 20px !important;
            background: #ea580c !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .receipt-content {
            padding: 16px 20px !important;
            gap: 14px !important;
          }

          .receipt-item-row {
            padding: 8px 12px !important;
            page-break-inside: avoid !important;
          }

          .receipt-item-img {
            height: 42px !important;
            width: 42px !important;
          }
        }
      `}</style>

      <div className="print-receipt-wrapper min-h-[80vh] bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
              <h2 className="mt-4 text-lg font-bold text-gray-900">
                Confirming your payment with Stripe...
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Please wait while we verify your transaction and prepare your order confirmation.
              </p>
            </div>
          ) : error && !order ? (
            <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 text-center">
              <span className="text-4xl">⚠️</span>
              <h2 className="mt-3 text-lg font-bold text-gray-900">Order Verification Notice</h2>
              <p className="mt-1 text-sm text-gray-600">{error}</p>
              <button
                onClick={handleReturnToGallery}
                className="mt-6 inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-bold bg-orange-600 text-white hover:bg-orange-700 transition"
              >
                Return to Gallery
              </button>
            </div>
          ) : (
            <div className="receipt-container bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header Banner */}
              <div className="receipt-header-banner bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-7 sm:px-10 text-white text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 mb-2.5 shadow-md">
                  <span className="text-2xl font-black">✓</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Payment Confirmed!
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-orange-100">
                  Thank you for your purchase with PicsEra Studio. Your archival fine-art prints are in production.
                </p>
              </div>

              {/* Test Mode Alert (Hidden in Print) */}
              <div className="no-print bg-amber-50 border-y border-amber-200 px-6 py-2.5 sm:px-10 flex items-center justify-between gap-3 text-xs text-amber-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase tracking-wider bg-amber-200/80 px-2 py-0.5 rounded text-[10px]">
                    Stripe Test Mode
                  </span>
                  <span>Real checkout session verified via Stripe. No real funds were charged.</span>
                </div>
                <span className="font-mono text-[11px] font-semibold hidden sm:inline">
                  Card: •••• 4242
                </span>
              </div>

              <div className="receipt-content p-6 sm:p-8 space-y-6">
                {/* Order Meta Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-400 font-medium">Order Number</span>
                    <p className="mt-1 text-sm font-black text-gray-900">#{order.id}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-400 font-medium">Payment Status</span>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-black uppercase px-2 py-0.5 rounded-full ${
                          order.status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        ● {order.status}
                      </span>
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-400 font-medium">Total Paid</span>
                    <p className="mt-1 text-sm font-black text-gray-900">
                      {formatAmount(order.total_amount)}{" "}
                      <span className="text-[10px] text-gray-500 font-normal">USD</span>
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-400 font-medium">Estimated Delivery</span>
                    <p className="mt-1 text-xs font-bold text-gray-900">2-3 Working Days</p>
                  </div>
                </div>

                {/* Purchased Fine Art Prints */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-800 mb-2.5 flex items-center justify-between">
                    <span>Purchased Prints</span>
                    <span className="text-xs text-gray-500 font-normal">
                      {order.items?.length || 0} {order.items?.length === 1 ? "item" : "items"}
                    </span>
                  </h3>

                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-white">
                    {(order.items || []).map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="receipt-item-row p-3.5 flex items-center gap-3.5 hover:bg-gray-50/50 transition"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="receipt-item-img h-14 w-14 object-cover rounded-lg border border-gray-200 shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                            {item.title}
                          </h4>
                          <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-gray-600">
                            <span className="bg-gray-100 px-2 py-0.5 rounded font-medium text-[11px]">
                              {item.productType || "FRAMED CANVAS"}
                            </span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded font-medium text-[11px]">
                              {item.size || "Small 30 × 40 cm"}
                            </span>
                            <span className="text-gray-500 text-[11px]">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                            {formatAmount(item.subtotal || item.unitPrice * item.quantity)}
                          </span>
                          <p className="text-[10px] text-gray-400">
                            {formatAmount(item.unitPrice)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transaction Technical Details */}
                <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/80 text-xs space-y-1 font-mono">
                  <div className="text-gray-500 font-bold uppercase tracking-wider font-sans mb-1 text-[10px]">
                    Payment Verification Record:
                  </div>
                  {order.stripe_payment_intent_id && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-gray-500 text-[11px]">Stripe Payment Intent:</span>
                      <span className="text-gray-900 select-all font-semibold break-all text-[11px]">
                        {order.stripe_payment_intent_id}
                      </span>
                    </div>
                  )}
                  {order.stripe_session_id && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-gray-500 text-[11px]">Checkout Session ID:</span>
                      <span className="text-gray-700 select-all break-all text-[11px]">
                        {order.stripe_session_id}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-gray-500 text-[11px]">Customer Email:</span>
                    <span className="text-gray-900 font-medium text-[11px]">
                      {order.customer_email || "Verified via Stripe"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons (Hidden when printing receipt) */}
                <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    🖨️ Print Receipt
                  </button>

                  <button
                    type="button"
                    onClick={handleReturnToGallery}
                    className="w-full sm:w-auto px-8 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md transition cursor-pointer active:scale-95"
                  >
                    Return to Gallery Portfolio →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
