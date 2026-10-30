import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ORDERS } from "../data/orders";
import { BOOKS } from "../data/books";
import { getCoverGradient } from "../components/BookCard";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${styles[status] || ""}`}
    >
      {status}
    </span>
  );
}

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const order = ORDERS.find((o) => o.id === Number(id));
  const [showAllEvents, setShowAllEvents] = useState(false);

  if (!order) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Order not found
          </h1>
          <p className="mt-2 text-slate-600">
            The order you are looking for does not exist.
          </p>
          <Link
            to="/profile"
            className="mt-4 inline-block text-sm font-medium text-slate-700 hover:text-slate-900 underline"
          >
            Back to profile
          </Link>
        </div>
      </main>
    );
  }

  const visibleEvents = showAllEvents
    ? order.trackingEvents
    : order.trackingEvents.slice(-3);
  const hasMore = order.trackingEvents.length > 3;

  const subtotal = order.items.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0,
  );

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
                to="/orders"
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                Orders
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li className="text-slate-900 font-medium">
              #{order.orderNumber}
            </li>
          </ol>
        </nav>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Order Details
        </h1>

        <div className="grid grid-cols-[1fr_380px] gap-6 items-start">
          {/* Left column */}
          <div className="space-y-6">
            {/* Order summary card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                <InfoRow
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  label="Order Date"
                  value={formatDate(order.date)}
                />
                <InfoRow
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  }
                  label="Order No."
                  value={
                    <span className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">
                        {order.orderNumber}
                      </span>
                      <button className="text-xs text-orange-600 hover:text-orange-700 font-medium italic transition-colors">
                        Reorder
                      </button>
                    </span>
                  }
                />
                <InfoRow
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  label="Status"
                  value={<StatusBadge status={order.status} />}
                />
                <InfoRow
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  label="Order Total"
                  value={
                    <span className="font-semibold text-slate-900">
                      {order.total.toFixed(2)} &euro;
                    </span>
                  }
                />
                {order.status === "Delivered" && order.deliveryDate && (
                  <InfoRow
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    }
                    label="Price Protection"
                    value={
                      <span>
                        <span className="font-semibold text-slate-900">
                          7 days
                        </span>
                        <span className="block text-xs text-slate-400 mt-0.5">
                          from the delivery date
                        </span>
                      </span>
                    }
                  />
                )}
              </div>
            </div>

            {/* Delivery / Shipping info */}
            {order.status === "Shipped" && order.expectedDelivery && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <div>
                    <p className="text-sm text-slate-600">
                      Expected delivery{" "}
                      <span className="font-semibold text-slate-900">
                        {order.expectedDelivery}
                      </span>{" "}
                      with{" "}
                      <span className="font-semibold text-slate-900">
                        {order.courier}
                      </span>
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Track Shipment
                </button>
              </div>
            )}

            {order.status === "Delivered" && order.deliveryDate && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-slate-600">
                  Delivered on{" "}
                  <span className="font-semibold text-slate-900">
                    {formatDate(order.deliveryDate)}
                  </span>{" "}
                  by{" "}
                  <span className="font-semibold text-slate-900">
                    {order.courier}
                  </span>
                </p>
              </div>
            )}

            {/* Order history timeline */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Order History
              </h2>

              <div className="relative">
                <div className="space-y-0">
                  {visibleEvents.map((event, i) => {
                    const isLast = i === visibleEvents.length - 1;
                    const isDelivered =
                      event.description === "Order delivered";
                    const isCancelled =
                      event.description === "Order cancelled";
                    return (
                      <div key={i} className="flex gap-4">
                        {/* Timeline dot + line */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full border-2 flex-shrink-0 mt-1 ${
                              isDelivered
                                ? "bg-emerald-500 border-emerald-500"
                                : isCancelled
                                  ? "bg-red-500 border-red-500"
                                  : "bg-white border-slate-300"
                            }`}
                          />
                          {!isLast && (
                            <div className="w-px flex-1 bg-slate-200 min-h-[28px]" />
                          )}
                        </div>
                        {/* Event content */}
                        <div className={`pb-5 ${isLast ? "pb-0" : ""}`}>
                          <p
                            className={`text-sm ${
                              isDelivered || isCancelled
                                ? "font-semibold text-slate-900"
                                : "text-slate-600"
                            }`}
                          >
                            {event.description}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {formatDate(event.date)} {event.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {hasMore && (
                  <button
                    onClick={() => setShowAllEvents(!showAllEvents)}
                    className="mt-4 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors mx-auto"
                  >
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${showAllEvents ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {showAllEvents
                      ? "Show less"
                      : "View full history"}
                  </button>
                )}
              </div>
            </div>

            {/* Order items */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-sm font-semibold text-slate-700">
                  Items ({order.items.length})
                </h2>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items.map((item) => {
                  const book = BOOKS.find((b) => b.id === item.bookId);
                  return (
                    <div
                      key={item.bookId}
                      className="flex gap-4 px-6 py-5 items-center"
                    >
                      {/* Book cover */}
                      <Link
                        to={`/products/${item.bookId}`}
                        className="w-16 flex-shrink-0 rounded-md overflow-hidden relative block"
                        style={{
                          background: getCoverGradient(item.bookId),
                          aspectRatio: "2/3",
                          width: "64px",
                        }}
                      >
                        <div className="absolute inset-0 flex items-end p-1.5 bg-gradient-to-t from-black/40 to-transparent">
                          <span className="text-white text-[8px] font-semibold leading-tight line-clamp-2 drop-shadow">
                            {item.title}
                          </span>
                        </div>
                      </Link>

                      {/* Item details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.bookId}`}
                          className="text-sm font-semibold text-slate-900 hover:text-slate-700 transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        {book && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            by {book.author}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          Price: {item.price.toFixed(2)} &euro; &middot;{" "}
                          {item.quantity}{" "}
                          {item.quantity === 1 ? "copy" : "copies"}
                        </p>
                      </div>

                      {/* Item total */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-slate-900">
                          {(item.price * item.quantity).toFixed(2)} &euro;
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column: summary sidebar */}
          <div className="space-y-6">
            {/* Delivery address */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Delivery Address
              </h2>
              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-medium text-slate-900">John Doe</p>
                <p>123 Book Street, Apt 4B</p>
                <p>Sofia, 1000</p>
                <p>Bulgaria</p>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Payment Method
              </h2>
              <p className="text-sm text-slate-600">{order.paymentMethod}</p>
            </div>

            {/* Order cost breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Order Summary
              </h2>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Subtotal ({order.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                    items)
                  </span>
                  <span className="text-slate-900">
                    {subtotal.toFixed(2)} &euro;
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span className="text-slate-900">
                    {order.shippingCost === 0
                      ? "Free"
                      : `${order.shippingCost.toFixed(2)} €`}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 mt-4 pt-4">
                <span className="text-sm font-bold text-slate-900">
                  Order Total
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {(subtotal + order.shippingCost).toFixed(2)} &euro;
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {order.status !== "Cancelled" && (
                <button className="w-full py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
                  Reorder
                </button>
              )}
              <Link
                to="/orders"
                className="w-full py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 px-6 py-3.5">
      <span className="text-slate-400 mt-0.5 flex-shrink-0">{icon}</span>
      <span className="text-sm text-slate-500 w-32 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm text-slate-900 flex-1">{value}</span>
    </div>
  );
}
