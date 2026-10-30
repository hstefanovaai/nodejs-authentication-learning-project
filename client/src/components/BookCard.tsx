import { Link } from "react-router-dom";
import type { Book } from "../data/books";

const COVER_GRADIENTS: [string, string][] = [
  ["#6366f1", "#8b5cf6"],
  ["#ec4899", "#f43f5e"],
  ["#3b82f6", "#06b6d4"],
  ["#10b981", "#14b8a6"],
  ["#f59e0b", "#ef4444"],
  ["#8b5cf6", "#ec4899"],
  ["#06b6d4", "#3b82f6"],
  ["#14b8a6", "#10b981"],
  ["#f43f5e", "#f59e0b"],
  ["#a855f7", "#6366f1"],
  ["#0ea5e9", "#8b5cf6"],
  ["#d946ef", "#fa71cd"],
];

export function getCoverGradient(id: number): string {
  const [from, to] = COVER_GRADIENTS[id % COVER_GRADIENTS.length];
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
}

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            rating >= star
              ? "text-amber-400"
              : rating >= star - 0.5
                ? "text-amber-300"
                : "text-slate-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-slate-500 ml-1">{rating}</span>
    </div>
  );
}

export function BookCover({
  bookId,
  title,
  className = "",
}: {
  bookId: number;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`w-full aspect-[2/3] rounded-lg overflow-hidden relative ${className}`}
      style={{ background: getCoverGradient(bookId) }}
    >
      <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/40 to-transparent">
        <span className="text-white text-xs font-semibold leading-tight line-clamp-3 drop-shadow">
          {title}
        </span>
      </div>
    </div>
  );
}

export function HeartIcon() {
  return (
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
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

export function CartIcon() {
  return (
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
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

function ActionButtons() {
  function stop(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={stop}
        className="text-slate-400 hover:text-rose-500 transition-colors"
        title="Add to favorites"
      >
        <HeartIcon />
      </button>
      <button
        onClick={stop}
        className="text-slate-400 hover:text-slate-700 transition-colors"
        title="Add to cart"
      >
        <CartIcon />
      </button>
    </div>
  );
}

export function BookCard({
  book,
  layout,
}: {
  book: Book;
  layout: "grid" | "list";
}) {
  if (layout === "list") {
    return (
      <Link
        to={`/products/${book.id}`}
        className="block bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex gap-5 hover:shadow-md transition-shadow"
      >
        <div className="w-28 flex-shrink-0">
          <BookCover bookId={book.id} title={book.title} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center justify-between">
            <StarRating rating={book.rating} />
            <ActionButtons />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mt-2 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{book.author}</p>
          <p className="text-sm font-bold text-slate-900 mt-auto pt-2">
            ${book.price.toFixed(2)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/products/${book.id}`}
      className="block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <BookCover bookId={book.id} title={book.title} />
      <div className="p-3">
        <div className="flex items-center justify-between">
          <StarRating rating={book.rating} />
          <ActionButtons />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 mt-2 line-clamp-2 min-h-10">
          {book.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 truncate">{book.author}</p>
        <p className="text-sm font-bold text-slate-900 mt-2">
          ${book.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
