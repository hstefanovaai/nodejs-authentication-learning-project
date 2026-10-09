import { Link } from 'react-router-dom'

export default function Navbar() {
  const navLinks = [
    { label: 'Products', href: '/products' },
    { label: 'Login', href: '/login' },
    { label: 'Sign up', href: '/signup' },
    { label: 'Admin', href: '/admin' },
  ]

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="text-2xl font-bold text-slate-900">Logo</div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {/* Text Links */}
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Icon Links */}
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              {/* Profile Icon */}
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

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="text-slate-700 hover:text-slate-900 transition-colors"
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
              </Link>

              {/* Favorites Icon */}
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
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
