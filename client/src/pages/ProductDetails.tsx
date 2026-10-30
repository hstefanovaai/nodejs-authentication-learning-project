import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { BOOKS, type Book } from "../data/books";
import {
  BookCover,
  BookCard,
  StarRating,
  HeartIcon,
  CartIcon,
} from "../components/BookCard";
import { useCart } from "../context/CartContext";

const PUBLISHERS: Record<string, string> = {
  Fiction: "Penguin Random House",
  "Non-Fiction": "HarperCollins",
  "Science Fiction": "Tor Books",
  Fantasy: "DAW Books",
  "Mystery & Thriller": "Simon & Schuster",
  Romance: "Harlequin",
  Biography: "Little, Brown and Company",
  History: "Oxford University Press",
  Science: "MIT Press",
  "Self-Help": "Hay House",
  "Children's Books": "Scholastic",
  Poetry: "Faber & Faber",
};

const CATEGORY_BLURBS: Record<string, string> = {
  Fiction:
    "a compelling work of fiction that takes readers on an unforgettable journey through vivid characters and intricate plotlines",
  "Non-Fiction":
    "an insightful exploration of real-world topics that challenges conventional thinking and offers fresh perspectives",
  "Science Fiction":
    "a groundbreaking science fiction novel that pushes the boundaries of imagination and explores profound questions about humanity and technology",
  Fantasy:
    "an epic fantasy adventure that transports readers to extraordinary worlds filled with magic, wonder, and unforgettable characters",
  "Mystery & Thriller":
    "a gripping mystery thriller that keeps readers on the edge of their seats with unexpected twists and a relentless pace",
  Romance:
    "a heartwarming romance that explores the complexities of love and relationships with tenderness and authenticity",
  Biography:
    "a powerful biographical work that offers intimate insights into a remarkable life, revealing both triumphs and challenges",
  History:
    "a meticulously researched history book that brings the past to life and illuminates how historical events continue to shape our world",
  Science:
    "a fascinating exploration of scientific discovery that makes complex concepts accessible and reveals the wonder of the natural world",
  "Self-Help":
    "a transformative guide that provides practical strategies and evidence-based insights for personal growth and fulfillment",
  "Children's Books":
    "a beloved children's book that sparks imagination and teaches valuable lessons through enchanting storytelling",
  Poetry:
    "a beautifully crafted collection of poetry that captures the depth of human emotion through powerful and evocative verse",
};

function getDescription(book: Book): string {
  const blurb = CATEGORY_BLURBS[book.category] || "a captivating read";
  return `${book.title} by ${book.author} is ${blurb}. Published in ${book.releaseYear}, this book has captivated readers worldwide with its masterful writing and emotional depth, earning a rating of ${book.rating} out of 5 stars from readers and critics alike. Whether you are a long-time fan of ${book.category.toLowerCase()} or discovering the genre for the first time, this is an essential addition to your reading list.`;
}

function getPages(id: number): number {
  return 180 + ((id * 37) % 320);
}

function getIsbn(id: number): string {
  const n = ((id * 73856093) >>> 0) % 1000000000;
  const s = String(n).padStart(9, "0");
  return `978-0-${s.slice(0, 3)}-${s.slice(3, 8)}-${s.slice(8)}`;
}

interface Review {
  id: number;
  author: string;
  date: string;
  rating: number;
  title: string;
  text: string;
  helpful: number;
}

const REVIEW_AUTHORS = [
  "Alex M.", "Sarah K.", "David L.", "Emma R.", "Michael T.",
  "Jessica P.", "Chris W.", "Amanda B.", "James H.", "Laura C.",
];

const REVIEW_TITLES_LIST = [
  "Absolutely loved it!", "A must-read for everyone",
  "Exceeded my expectations", "Highly recommended",
  "Couldn't put it down", "Thought-provoking and inspiring",
  "A wonderful experience", "Simply brilliant",
  "Great addition to my shelf", "An engaging read",
];

const REVIEW_BODIES = [
  "This book completely changed my perspective. The writing is beautiful and the story is captivating from start to finish. I've already recommended it to all my friends and family.",
  "One of the best books I've read this year. The author has a gift for storytelling that keeps you engaged throughout every chapter. Truly outstanding work.",
  "I was skeptical at first but this book won me over. The characters are well-developed and the plot keeps you guessing until the very end.",
  "A beautifully written book that touches on important themes. I found myself highlighting passages on almost every page. Will definitely reread.",
  "This was my first book by this author and I'm now a huge fan. The prose is elegant and the story is deeply moving. Cannot wait to read more.",
  "Picked this up on a whim and it turned out to be one of my favorite reads. Perfect for anyone who enjoys thoughtful, well-crafted stories.",
  "The author's attention to detail is remarkable. Every scene feels vivid and immersive. A truly memorable reading experience that I won't forget.",
  "I've read this book twice already and discover something new each time. It's the kind of book that stays with you long after you finish.",
  "An excellent book that delivers on its promise. Well-paced, beautifully written, and thoroughly enjoyable from beginning to end.",
  "This book exceeded all my expectations. It's rare to find writing this good that also tells such a compelling story. Masterful.",
];

const AVATAR_COLORS = [
  "#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ec4899",
  "#14b8a6", "#6366f1", "#f59e0b", "#06b6d4", "#e11d48",
];

function generateReviews(bookId: number, bookRating: number): Review[] {
  const count = 3 + (bookId % 5);
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const seed = bookId * 10 + i;
    const ratingBase = Math.round(bookRating);
    let rating: number;
    if (i === 0) rating = 5;
    else if (i === count - 1 && bookRating < 4.7) rating = Math.max(1, ratingBase - 2);
    else rating = Math.min(5, Math.max(3, ratingBase + ((seed % 3) - 1)));

    const month = ((seed * 3) % 12) + 1;
    const day = ((seed * 7) % 28) + 1;
    const year = 2025 + (seed % 2);
    const date = new Date(year, month - 1, day);

    reviews.push({
      id: seed,
      author: REVIEW_AUTHORS[seed % REVIEW_AUTHORS.length],
      date: date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      rating,
      title: REVIEW_TITLES_LIST[seed % REVIEW_TITLES_LIST.length],
      text: REVIEW_BODIES[seed % REVIEW_BODIES.length],
      helpful: (seed * 3) % 15,
    });
  }
  return reviews;
}

const SORT_REVIEWS = [
  { value: "recent", label: "Recently added" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
  { value: "helpful", label: "Most helpful" },
];

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const book = BOOKS.find((b) => b.id === Number(id));

  const relatedBooks = useMemo(() => {
    if (!book) return [];
    return BOOKS.filter(
      (b) => b.category === book.category && b.id !== book.id,
    ).slice(0, 5);
  }, [book]);

  if (!book) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Product not found
          </h1>
          <p className="mt-2 text-slate-600">
            The book you are looking for does not exist.
          </p>
          <Link
            to="/products"
            className="mt-4 inline-block text-sm font-medium text-slate-700 hover:text-slate-900 underline"
          >
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  const { addToCart } = useCart();
  const publisher = PUBLISHERS[book.category] || "Independent Press";
  const pages = getPages(book.id);
  const isbn = getIsbn(book.id);
  const reviews = useMemo(() => generateReviews(book.id, book.rating), [book]);
  const [reviewSort, setReviewSort] = useState("recent");

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (reviewSort) {
      case "highest": sorted.sort((a, b) => b.rating - a.rating); break;
      case "lowest": sorted.sort((a, b) => a.rating - b.rating); break;
      case "helpful": sorted.sort((a, b) => b.helpful - a.helpful); break;
      default: break;
    }
    return sorted;
  }, [reviews, reviewSort]);

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const reviewCount = reviews.length;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <nav className="max-w-[1440px] mx-auto px-6 py-3">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li>
              <Link
                to="/products"
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                Products
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li className="text-slate-900 font-medium truncate max-w-xs">
              {book.title}
            </li>
          </ol>
        </nav>
      </div>

      {/* Product Section */}
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="flex gap-10">
            {/* Left: Product Image */}
            <div className="w-[380px] flex-shrink-0">
              <BookCover
                bookId={book.id}
                title={book.title}
                className="rounded-xl"
              />
            </div>

            {/* Right: Product Details */}
            <div className="flex-1 min-w-0">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                {book.category}
              </span>

              <h1 className="text-3xl font-bold text-slate-900 mt-3">
                {book.title}
              </h1>

              <p className="text-slate-600 mt-2">
                by{" "}
                <span className="font-medium text-slate-900">
                  {book.author}
                </span>
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-4">
                <StarRating rating={book.rating} />
                <span className="text-sm text-slate-500">
                  ({reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-6">
                <span className="text-3xl font-bold text-slate-900">
                  ${book.price.toFixed(2)}
                </span>
              </div>

              {/* Stock */}
              <p className="text-sm font-medium text-emerald-600 mt-2">
                In Stock &mdash; Ready to ship
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => addToCart(book)}
                  className="bg-slate-900 text-white py-2.5 px-5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <CartIcon />
                  Add to Cart
                </button>
                <button
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-500 hover:border-rose-200 transition-colors"
                  title="Add to favorites"
                >
                  <HeartIcon />
                </button>
              </div>

              <hr className="my-6 border-slate-200" />

              {/* Product Details Table */}
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Product Details
              </h3>
              <dl className="grid grid-cols-[auto_1fr] gap-y-2.5 gap-x-8 text-sm">
                <dt className="text-slate-500">Author</dt>
                <dd className="text-slate-900">{book.author}</dd>
                <dt className="text-slate-500">Category</dt>
                <dd className="text-slate-900">{book.category}</dd>
                <dt className="text-slate-500">Publisher</dt>
                <dd className="text-slate-900">{publisher}</dd>
                <dt className="text-slate-500">Pages</dt>
                <dd className="text-slate-900">{pages}</dd>
                <dt className="text-slate-500">Release Year</dt>
                <dd className="text-slate-900">{book.releaseYear}</dd>
                <dt className="text-slate-500">Language</dt>
                <dd className="text-slate-900">English</dd>
                <dt className="text-slate-500">ISBN</dt>
                <dd className="text-slate-900">{isbn}</dd>
              </dl>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              About this book
            </h2>
            <p className="text-slate-600 leading-relaxed max-w-3xl">
              {getDescription(book)}
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mt-6">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-8">
            Reviews
          </h2>

          {/* Rating Summary */}
          <div className="grid grid-cols-[auto_1fr_auto] gap-8 items-start mb-8">
            {/* Left: Average Score */}
            <div className="text-center px-4">
              <div className="text-5xl font-bold text-slate-900">
                {avgRating.toFixed(1)}
                <span className="text-2xl text-slate-400 font-normal">
                  /5
                </span>
              </div>
              <div className="flex items-center justify-center gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      avgRating >= star
                        ? "text-amber-400"
                        : avgRating >= star - 0.5
                          ? "text-amber-300"
                          : "text-slate-200"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {reviewCount} reviews
              </p>
            </div>

            {/* Center: Rating Bars */}
            <div className="space-y-2 pt-1">
              {ratingCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-6 text-right flex items-center justify-end gap-1">
                    {star}
                    <svg
                      className="w-3.5 h-3.5 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    {count > 0 && (
                      <div
                        className={`h-full rounded-full ${star >= 2 ? "bg-emerald-500" : "bg-red-500"}`}
                        style={{
                          width: `${(count / reviewCount) * 100}%`,
                        }}
                      />
                    )}
                  </div>
                  <span className="text-sm text-slate-500 w-6">
                    ({count})
                  </span>
                </div>
              ))}
            </div>

            {/* Right: Add Review CTA */}
            <div className="text-center px-4">
              <p className="text-slate-700 font-medium mb-3">
                Have an opinion about this book?
              </p>
              <button className="bg-slate-900 text-white py-2.5 px-6 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
                Add Review
              </button>
            </div>
          </div>

          <hr className="border-slate-200 mb-6" />

          {/* Sort */}
          <div className="flex items-center gap-3 mb-6">
            <label
              htmlFor="review-sort"
              className="text-sm text-slate-600"
            >
              Sort by:
            </label>
            <select
              id="review-sort"
              value={reviewSort}
              onChange={(e) => setReviewSort(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {SORT_REVIEWS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Review Cards */}
          <div className="space-y-0 divide-y divide-slate-200">
            {sortedReviews.map((review) => (
              <div key={review.id} className="flex gap-6 py-6 first:pt-0 last:pb-0">
                {/* Left: Avatar + Author Info */}
                <div className="w-28 flex-shrink-0">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{
                      backgroundColor:
                        AVATAR_COLORS[review.id % AVATAR_COLORS.length],
                    }}
                  >
                    {review.author[0]}
                  </div>
                  <p className="text-sm font-medium text-slate-900 mt-2">
                    {review.author}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {review.date}
                  </p>
                </div>

                {/* Right: Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-slate-900">
                      {review.title}
                    </h4>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            review.rating >= star
                              ? "text-amber-400"
                              : "text-slate-200"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {review.text}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                    <span>Was this review helpful?</span>
                    <span className="text-slate-300">|</span>
                    <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      {review.helpful}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              You might also like
            </h2>
            <div className="grid grid-cols-5 gap-4">
              {relatedBooks.map((related) => (
                <BookCard key={related.id} book={related} layout="grid" />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
