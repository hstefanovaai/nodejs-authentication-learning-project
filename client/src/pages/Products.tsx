import { useState, useRef, useMemo, useEffect } from "react";
import { BOOKS, CATEGORIES, type Book } from "../data/books";
import { BookCard } from "../components/BookCard";

const SORT_OPTIONS = [
  { value: "new", label: "New Releases" },
  { value: "best", label: "Best Sellers" },
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Lowest Price" },
  { value: "price-high", label: "Highest Price" },
];

const ITEMS_PER_PAGE = 20;

export default function Products() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    function update() {
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, []);

  const topSellers = useMemo(
    () => [...BOOKS].sort((a, b) => b.popularity - a.popularity).slice(0, 20),
    [],
  );

  const filteredAndSorted = useMemo(() => {
    let result: Book[] = BOOKS;
    if (selectedCategories.length > 0) {
      result = result.filter((b) => selectedCategories.includes(b.category));
    }
    result = [...result];
    switch (sortBy) {
      case "new":
        result.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case "best":
        result.sort((a, b) => b.popularity - a.popularity);
        break;
      case "popular":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
    }
    return result;
  }, [selectedCategories, sortBy]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredAndSorted.length,
  );

  function handleCategoryToggle(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setCurrentPage(1);
  }

  function handleSortChange(value: string) {
    setSortBy(value);
    setCurrentPage(1);
  }

  function scrollSlider(direction: "left" | "right") {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.8;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── Intro Slider Section ── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Top 20 Most Selling Books
          </h2>

          <div className="relative">
            {canScrollLeft && (
              <button
                onClick={() => scrollSlider("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900 hover:shadow-lg transition"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            <div
              ref={sliderRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-none"
            >
              {topSellers.map((book) => (
                <div
                  key={book.id}
                  className="flex-shrink-0 w-[200px] snap-start"
                >
                  <BookCard book={book} layout="grid" />
                </div>
              ))}
            </div>

            {canScrollRight && (
              <button
                onClick={() => scrollSlider("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900 hover:shadow-lg transition"
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-[1440px] mx-auto px-6 py-8 flex gap-8">
        {/* ── Left Sidebar: Category Filter ── */}
        <aside className="w-60 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Categories
              </h3>
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setCurrentPage(1);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="space-y-3">
              {CATEGORIES.map((cat) => {
                const count = BOOKS.filter((b) => b.category === cat).length;
                return (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors flex-1">
                      {cat}
                    </span>
                    <span className="text-xs text-slate-400">{count}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Right: Product Listing ── */}
        <div className="flex-1 min-w-0">
          {/* Controls Header */}
          <div className="flex items-center justify-between mb-6 bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-3">
            <p className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-medium text-slate-900">
                {filteredAndSorted.length > 0 ? startIndex : 0}&ndash;
                {endIndex}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-900">
                {filteredAndSorted.length}
              </span>{" "}
              products
            </p>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort-select"
                  className="text-sm text-slate-600 whitespace-nowrap"
                >
                  Order by:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Layout Toggle */}
              <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setLayout("grid")}
                  className={`p-2 transition-colors ${
                    layout === "grid"
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-500 hover:text-slate-700"
                  }`}
                  title="Grid view"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <rect x="1" y="1" width="6" height="6" rx="1" />
                    <rect x="9" y="1" width="6" height="6" rx="1" />
                    <rect x="1" y="9" width="6" height="6" rx="1" />
                    <rect x="9" y="9" width="6" height="6" rx="1" />
                  </svg>
                </button>
                <button
                  onClick={() => setLayout("list")}
                  className={`p-2 transition-colors ${
                    layout === "list"
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-500 hover:text-slate-700"
                  }`}
                  title="List view"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <rect x="1" y="1" width="14" height="3" rx="1" />
                    <rect x="1" y="6.5" width="14" height="3" rx="1" />
                    <rect x="1" y="12" width="14" height="3" rx="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid / List */}
          {paginatedBooks.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No products found matching your filters.
            </div>
          ) : layout === "grid" ? (
            <div className="grid grid-cols-5 gap-4">
              {paginatedBooks.map((book) => (
                <BookCard key={book.id} book={book} layout="grid" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {paginatedBooks.map((book) => (
                <BookCard key={book.id} book={book} layout="list" />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 text-sm rounded-lg transition-colors ${
                      page === currentPage
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
