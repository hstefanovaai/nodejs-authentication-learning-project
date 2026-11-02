import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  function handleMouseEnter() {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  async function handleLogout() {
    setOpen(false);
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  const menuItems = [
    { label: "My profile", to: "/profile" },
    { label: "My orders", to: "/orders" },
    { label: "Favorites", to: "/favorites" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to="/profile"
        className="text-slate-700 hover:text-slate-900 transition-colors"
        title="Profile"
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
            d="M12 12a3 3 0 100-6 3 3 0 000 6zm0 0c3.866 0 7.306 1.255 10 3.336V20H2v-4.664C4.694 13.255 8.134 12 12 12z"
          />
        </svg>
      </Link>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-50">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {!loading && user && (
            <>
              <div className="border-t border-slate-200 my-1" />
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
