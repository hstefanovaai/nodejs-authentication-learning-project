import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { BookCover, StarRating } from "../components/BookCard";

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          My Favorites
        </h2>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">
              You haven't added any favorites yet.
            </p>
            <Link
              to="/products"
              className="inline-block mt-4 text-sm font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700 transition-colors"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {favorites.map((book) => (
              <div
                key={book.id}
                className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Delete button */}
                <button
                  onClick={() => removeFavorite(book.id)}
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors"
                  title="Remove from favorites"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>

                <Link to={`/products/${book.id}`} className="block">
                  <BookCover bookId={book.id} title={book.title} />
                  <div className="p-3">
                    <StarRating rating={book.rating} />
                    <h3 className="text-sm font-semibold text-slate-900 mt-2 line-clamp-2 min-h-10">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {book.author}
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-2">
                      ${book.price.toFixed(2)}
                    </p>
                  </div>
                </Link>

                <div className="px-3 pb-3 mt-auto">
                  <button
                    onClick={() => addToCart(book)}
                    className="w-full py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
