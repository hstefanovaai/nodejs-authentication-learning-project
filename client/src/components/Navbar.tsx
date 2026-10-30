import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartDropdown from "./CartDropdown";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  const { user, loading } = useAuth();
  const { totalPrice } = useCart();

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="text-2xl font-bold text-slate-900">Logo</div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {/* Text Links */}
            <div className="flex gap-6">
              <Link
                to="/products"
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Products
              </Link>

              <Link
                to="/orders"
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                My Orders
              </Link>

              <Link
                to="/admin"
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                admin
              </Link>

              {!user && !loading && (
                <>
                  <Link
                    to="/login"
                    className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              )}

            </div>

            {/* Icon Links */}
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <ProfileDropdown />

              <Link
                to="/favorites"
                className="text-slate-700 hover:text-slate-900 transition-colors"
                title="Favorites"
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Link>

              <CartDropdown />

              <div className="flex items-center gap-1 pl-3 border-l border-slate-200">
                <span className="text-lg font-bold text-slate-900">
                  {totalPrice.toFixed(2)}
                </span>
                <span className="text-sm text-slate-500">&euro;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
