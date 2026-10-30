import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ORDERS, type Order } from "../data/orders";
import { getCoverGradient } from "../components/BookCard";

const CURRENT_YEAR = new Date().getFullYear();

const PERIOD_OPTIONS = [
  { value: "all", label: "All" },
  { value: "1m", label: "Previous month" },
  { value: "3m", label: "3 months" },
  { value: "6m", label: "6 months" },
  { value: "year", label: `${CURRENT_YEAR}` },
  { value: `${CURRENT_YEAR - 1}`, label: `${CURRENT_YEAR - 1}` },
  { value: `${CURRENT_YEAR - 2}`, label: `${CURRENT_YEAR - 2}` },
  { value: `${CURRENT_YEAR - 3}`, label: `${CURRENT_YEAR - 3}` },
];

const ITEMS_PER_PAGE = 5;

function statusColor(status: Order["status"]) {
  switch (status) {
    case "Delivered":
      return "text-emerald-600";
    case "Shipped":
      return "text-blue-600";
    case "Processing":
      return "text-amber-600";
    case "Cancelled":
      return "text-red-500";
  }
}

function filterByPeriod(orders: Order[], period: string): Order[] {
  if (period === "all") return orders;

  const now = new Date();

  if (period === "1m") {
    const cutoff = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    return orders.filter((o) => new Date(o.date) >= cutoff);
  }
  if (period === "3m") {
    const cutoff = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    return orders.filter((o) => new Date(o.date) >= cutoff);
  }
  if (period === "6m") {
    const cutoff = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    return orders.filter((o) => new Date(o.date) >= cutoff);
  }
  if (period === "year") {
    return orders.filter((o) => new Date(o.date).getFullYear() === CURRENT_YEAR);
  }

  const year = parseInt(period, 10);
  if (!isNaN(year)) {
    return orders.filter((o) => new Date(o.date).getFullYear() === year);
  }

  return orders;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function OrderHistory() {
  const [period, setPeriod] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => filterByPeriod(ORDERS, period), [period]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  function handlePeriodChange(value: string) {
    setPeriod(value);
    setCurrentPage(1);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Orders</h1>

        {/* Filter bar */}
        <div className="flex items-center gap-3 mb-6 bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-3">
          <label htmlFor="period-select" className="text-sm text-slate-600 whitespace-nowrap">
            Select period:
          </label>
          <select
            id="period-select"
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Order list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            No orders found for the selected period.
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {paginated.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Order details */}
                  <div className="flex-1 min-w-0">
                    {/* Info rows */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-slate-600 w-36">Order number</span>
                        <span className="text-sm font-semibold text-slate-900">{order.orderNumber}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-slate-600 w-36">Date</span>
                        <span className="text-sm font-semibold text-slate-900">{formatDate(order.date)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm text-slate-600 w-36">Order total</span>
                        <span className="text-sm font-semibold text-slate-900">{order.total.toFixed(2)} &euro;</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="text-sm text-slate-600 w-36">Status</span>
                        <span className={`text-sm font-semibold ${statusColor(order.status)}`}>{order.status}</span>
                      </div>
                    </div>

                    {/* Product thumbnails */}
                    <div className="flex items-center gap-2 mt-5">
                      {order.items.slice(0, 4).map((item) => (
                        <div
                          key={item.bookId}
                          className="w-12 h-16 rounded-md overflow-hidden relative flex-shrink-0"
                          style={{ background: getCoverGradient(item.bookId) }}
                          title={item.title}
                        >
                          <div className="absolute inset-0 flex items-end p-1 bg-gradient-to-t from-black/40 to-transparent">
                            <span className="text-white text-[6px] font-semibold leading-tight line-clamp-2 drop-shadow">
                              {item.title}
                            </span>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <span className="text-xs text-slate-400 ml-1">
                          +{order.items.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Delivery info badge */}
                    {order.status === "Delivered" && order.deliveryDate && (
                      <div className="mt-4">
                        <span className="inline-block text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                          Delivered on {formatDate(order.deliveryDate)}
                        </span>
                      </div>
                    )}
                    {order.status === "Shipped" && order.expectedDelivery && (
                      <div className="mt-4">
                        <span className="inline-block text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                          Expected delivery {order.expectedDelivery}
                          {order.courier && ` via ${order.courier}`}
                        </span>
                      </div>
                    )}
                    {order.status === "Processing" && (
                      <div className="mt-4">
                        <span className="inline-block text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                          Your order is being processed
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action button */}
                  <div className="flex-shrink-0">
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                    >
                      View Order
                    </Link>
                  </div>
                </div>
              </div>
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
