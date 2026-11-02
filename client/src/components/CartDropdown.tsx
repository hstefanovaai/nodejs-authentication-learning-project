import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getCoverGradient } from "./BookCard";

export default function CartDropdown() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity } =
    useCart();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cart Icon with Badge */}
      <Link
        to="/cart"
        className="relative text-slate-700 hover:text-slate-900 transition-colors"
        title="Cart"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full leading-none min-w-[18px] min-h-[18px]">
          {totalItems}
        </span>
      </Link>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50">
          {items.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-slate-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Items list */}
              <div className="max-h-72 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.book.id} className="flex gap-3">
                    {/* Book cover thumbnail */}
                    <div
                      className="w-14 h-20 rounded-md flex-shrink-0 overflow-hidden relative"
                      style={{
                        background: getCoverGradient(item.book.id),
                      }}
                    >
                      <div className="absolute inset-0 flex items-end p-1.5 bg-gradient-to-t from-black/40 to-transparent">
                        <span className="text-white text-[8px] font-semibold leading-tight line-clamp-2 drop-shadow">
                          {item.book.title}
                        </span>
                      </div>
                    </div>

                    {/* Item details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/products/${item.book.id}`}
                          className="text-sm font-medium text-slate-900 line-clamp-2 hover:text-slate-700 transition-colors"
                        >
                          {item.book.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.book.id)}
                          className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 mt-0.5"
                          title="Remove"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-sm font-bold text-slate-900">
                          {(item.book.price * item.quantity).toFixed(2)} &euro;
                        </p>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          x&nbsp;
                          <select
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.book.id,
                                Number(e.target.value),
                              )
                            }
                            className="border border-slate-200 rounded px-1 py-0.5 text-xs text-slate-700 bg-white focus:outline-none"
                          >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(
                              (n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Total:
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {totalPrice.toFixed(2)} &euro;
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/cart"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-medium border border-slate-900 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Go to Cart
                  </Link>
                  <button className="flex-1 py-2.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Buy
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
