import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { BOOKS, type Book } from "../data/books";
import {
  BookCover,
  BookCard,
  StarRating,
  HeartIcon,
  CartIcon,
} from "../components/BookCard";

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

  const publisher = PUBLISHERS[book.category] || "Independent Press";
  const pages = getPages(book.id);
  const isbn = getIsbn(book.id);
  const reviewCount = Math.floor(book.popularity * 1.5);

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
              <div className="flex gap-3 mt-6">
                <button className="flex-1 bg-slate-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <CartIcon />
                  Add to Cart
                </button>
                <button className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-500 hover:border-rose-200 transition-colors flex items-center justify-center gap-2">
                  <HeartIcon />
                  <span className="text-sm font-medium">Favorites</span>
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
