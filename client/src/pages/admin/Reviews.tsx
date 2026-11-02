import { useState } from "react";
import { ADMIN_REVIEWS } from "../../data/admin";

const statusColors: Record<string, string> = {
  Approved: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Rejected: "bg-rose-50 text-rose-700",
};

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = ADMIN_REVIEWS.filter((r) => statusFilter === "All" || r.status === statusFilter);

  const pendingCount = ADMIN_REVIEWS.filter((r) => r.status === "Pending").length;
  const avgRating = (ADMIN_REVIEWS.reduce((s, r) => s + r.rating, 0) / ADMIN_REVIEWS.length).toFixed(1);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reviews & Ratings</h1>
          <p className="text-slate-500 mt-1">Moderate customer reviews</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Total Reviews</p>
          <p className="text-2xl font-bold text-slate-900">{ADMIN_REVIEWS.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Pending Moderation</p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Average Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-slate-900">{avgRating}</p>
            <StarDisplay rating={Math.round(Number(avgRating))} />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {["All", "Pending", "Approved", "Rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s
                ? "bg-orange-500 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s}
            {s === "Pending" && pendingCount > 0 && (
              <span className="ml-1.5 bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                  {review.customer.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{review.customer}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[review.status]}`}>
                      {review.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    on <span className="text-slate-600">{review.productTitle}</span> · {review.date}
                  </p>
                </div>
              </div>
              <StarDisplay rating={review.rating} />
            </div>

            <div className="ml-14">
              <p className="font-medium text-slate-900 mb-1">{review.title}</p>
              <p className="text-sm text-slate-600">{review.comment}</p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-4">
                {review.status === "Pending" && (
                  <>
                    <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                      Approve
                    </button>
                    <button className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                      Reject
                    </button>
                  </>
                )}
                <button className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 py-12 text-center text-slate-400">
            No reviews match this filter.
          </div>
        )}
      </div>
    </div>
  );
}
