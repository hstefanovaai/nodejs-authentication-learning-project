import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getCoverGradient } from "../components/BookCard";

export default function Cart() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity } =
    useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-[1440px] mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Your Cart</h1>
          <p className="mt-6 text-slate-500">Your cart is empty.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Your Cart</h1>

        <div className="flex gap-8 items-start">
          {/* Left: Cart table */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_130px_140px_130px_40px] gap-4 px-6 py-4 border-b border-slate-200 bg-slate-50">
                <span className="text-sm font-semibold text-slate-700">
                  Product
                </span>
                <span className="text-sm font-semibold text-slate-700 text-center">
                  Unit Price
                </span>
                <span className="text-sm font-semibold text-slate-700 text-center">
                  Quantity
                </span>
                <span className="text-sm font-semibold text-slate-700 text-center">
                  Total
                </span>
                <span />
              </div>

              {/* Cart items */}
              {items.map((item) => (
                <div
                  key={item.book.id}
                  className="grid grid-cols-[1fr_130px_140px_130px_40px] gap-4 px-6 py-5 border-b border-slate-100 last:border-b-0 items-center"
                >
                  {/* Product */}
                  <div className="flex gap-4 items-center min-w-0">
                    <Link
                      to={`/products/${item.book.id}`}
                      className="w-16 h-22 rounded-md flex-shrink-0 overflow-hidden relative block"
                      style={{
                        background: getCoverGradient(item.book.id),
                        aspectRatio: "2/3",
                        width: "64px",
                      }}
                    >
                      <div className="absolute inset-0 flex items-end p-1.5 bg-gradient-to-t from-black/40 to-transparent">
                        <span className="text-white text-[8px] font-semibold leading-tight line-clamp-2 drop-shadow">
                          {item.book.title}
                        </span>
                      </div>
                    </Link>
                    <div className="min-w-0">
                      <Link
                        to={`/products/${item.book.id}`}
                        className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-slate-700 transition-colors"
                      >
                        {item.book.title}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">
                        by {item.book.author}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Category: {item.book.category}
                      </p>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="text-center">
                    <span className="text-sm font-semibold text-slate-900">
                      {item.book.price.toFixed(2)} &euro;
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.book.id, item.quantity - 1)
                        }
                        className="w-9 h-9 flex items-center justify-center bg-slate-800 text-white hover:bg-slate-700 transition-colors text-lg font-medium"
                      >
                        &minus;
                      </button>
                      <span className="w-10 h-9 flex items-center justify-center text-sm font-medium text-slate-900 bg-white border-x border-slate-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.book.id, item.quantity + 1)
                        }
                        className="w-9 h-9 flex items-center justify-center bg-slate-800 text-white hover:bg-slate-700 transition-colors text-lg font-medium"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="text-center">
                    <span className="text-sm font-bold text-slate-900">
                      {(item.book.price * item.quantity).toFixed(2)} &euro;
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.book.id)}
                    className="text-slate-400 hover:text-slate-600 transition-colors justify-self-center"
                    title="Remove item"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right: Order summary sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-8">
              {/* Promo code */}
              <div className="mb-6">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-sm font-semibold text-slate-700">
                    Add voucher / promo code
                  </span>
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Enter voucher / promo code"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                />
              </div>

              {/* Summary */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {totalPrice.toFixed(2)} &euro;
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Discount</span>
                  <span className="text-sm font-semibold text-slate-900">
                    0.00 &euro;
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t border-b border-slate-200 py-4 mb-6">
                <span className="text-base font-bold text-slate-900">
                  Total:
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {totalPrice.toFixed(2)} &euro;
                </span>
              </div>

              {/* Checkout button */}
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors uppercase tracking-wide">
                Proceed to Checkout
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Payment icons */}
              <div className="flex items-center justify-center gap-3 mt-5 text-slate-400">
                <svg viewBox="0 0 38 24" className="h-6 w-auto">
                  <rect
                    width="38"
                    height="24"
                    rx="3"
                    fill="#fff"
                    stroke="#e2e8f0"
                  />
                  <circle cx="15" cy="12" r="7" fill="#eb001b" />
                  <circle cx="23" cy="12" r="7" fill="#f79e1b" />
                  <path
                    d="M19 7.3a7 7 0 010 9.4 7 7 0 000-9.4z"
                    fill="#ff5f00"
                  />
                </svg>
                <svg viewBox="0 0 38 24" className="h-6 w-auto">
                  <rect
                    width="38"
                    height="24"
                    rx="3"
                    fill="#fff"
                    stroke="#e2e8f0"
                  />
                  <path
                    d="M15.8 8.4L14.2 15.6h2l1.6-7.2h-2zm8.8 0l-2.4 4.9-.4-2-.8-2.5c-.1-.4-.5-.5-.9-.5h-3l-.1.3c.6.1 1.3.4 1.7.6l2 7.4h2.1l3.2-8.2h-1.4zm-5.5 7.2l.9-4.5c-.5-.2-1.2-.4-1.9-.4-2.1 0-3.6 1.1-3.6 2.7 0 1.2 1 1.8 1.9 2.2.8.4 1.1.6 1.1 1 0 .5-.7.8-1.3.8-.9 0-1.4-.1-2.1-.5l-.3-.1-.3 1.8c.5.2 1.5.5 2.5.5 2.2 0 3.7-1.1 3.7-2.8 0-.9-.5-1.6-1.7-2.2-.7-.4-1.2-.6-1.2-1 0-.3.4-.7 1.2-.7.7 0 1.2.2 1.6.3l.2.1.2-1.2h1z"
                    fill="#1a1f71"
                  />
                </svg>
                <svg viewBox="0 0 38 24" className="h-6 w-auto">
                  <rect
                    width="38"
                    height="24"
                    rx="3"
                    fill="#fff"
                    stroke="#e2e8f0"
                  />
                  <path
                    d="M19 7.5c-1.4 0-2.5.5-3.3 1.3l.9.9c.6-.6 1.4-.9 2.4-.9s1.8.3 2.4.9l.9-.9C21.5 8 20.4 7.5 19 7.5zM19 16.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
                    fill="#000"
                  />
                </svg>
                <svg viewBox="0 0 38 24" className="h-6 w-auto">
                  <rect
                    width="38"
                    height="24"
                    rx="3"
                    fill="#fff"
                    stroke="#e2e8f0"
                  />
                  <text
                    x="19"
                    y="15"
                    textAnchor="middle"
                    fontSize="8"
                    fontFamily="system-ui"
                    fill="#000"
                  >
                    G Pay
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
